import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import LinkedInProvider from "next-auth/providers/linkedin"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const oauthProviders: NextAuthOptions["providers"] = []

if (process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    })
  )
}

if (process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID.trim(),
      clientSecret: process.env.GITHUB_CLIENT_SECRET.trim(),
    })
  )
}

if (process.env.LINKEDIN_CLIENT_ID?.trim() && process.env.LINKEDIN_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID.trim(),
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET.trim(),
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days rolling session persistence
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    ...oauthProviders,
    CredentialsProvider({
      id: "credentials-password",
      name: "Password Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            employees: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            candidates: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const account = await prisma.account.findFirst({
          where: { userId: user.id, provider: "credentials" },
        })

        const passwordHash = account?.providerAccountId

        if (!passwordHash) {
          throw new Error("Account relies on social login or OTP. Please use OTP or Google/GitHub login.")
        }

        const isValidPassword = await bcrypt.compare(credentials.password, passwordHash)
        if (!isValidPassword) {
          throw new Error("Invalid password")
        }

        const activeEmployee = user.employees[0]
        const activeCandidate = user.candidates[0]

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          organizationId: activeEmployee?.organizationId || null,
          employeeId: activeEmployee?.id || null,
          candidateId: activeCandidate?.id || null,
          role: activeEmployee?.role || null,
          employeeStatus: activeEmployee?.status || null,
        }
      },
    }),
    CredentialsProvider({
      id: "credentials-otp",
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email and OTP code are required")
        }

        const email = credentials.email.toLowerCase()
        const otpCode = credentials.otp.trim()

        const verificationToken = await prisma.verificationToken.findFirst({
          where: {
            identifier: `login-otp:${email}`,
            token: otpCode,
          },
        })

        if (!verificationToken) {
          throw new Error("Invalid OTP code")
        }

        if (verificationToken.expires < new Date()) {
          await prisma.verificationToken.delete({ where: { id: verificationToken.id } })
          throw new Error("OTP code has expired. Please request a new code.")
        }

        await prisma.verificationToken.delete({ where: { id: verificationToken.id } })

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            employees: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            candidates: {
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const activeEmployee = user.employees[0]
        const activeCandidate = user.candidates[0]

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          image: user.image,
          organizationId: activeEmployee?.organizationId || null,
          employeeId: activeEmployee?.id || null,
          candidateId: activeCandidate?.id || null,
          role: activeEmployee?.role || null,
          employeeStatus: activeEmployee?.status || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email!
        token.organizationId = user.organizationId
        token.employeeId = user.employeeId
        token.candidateId = user.candidateId
        token.role = user.role
        token.employeeStatus = user.employeeStatus
      }

      if (trigger === "update" && session) {
        if (session.organizationId !== undefined) token.organizationId = session.organizationId
        if (session.employeeId !== undefined) token.employeeId = session.employeeId
        if (session.candidateId !== undefined) token.candidateId = session.candidateId
        if (session.role !== undefined) token.role = session.role
        if (session.employeeStatus !== undefined) token.employeeStatus = session.employeeStatus
      }

      if (token.id && (!token.employeeId || !token.candidateId)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: {
            employees: { take: 1, orderBy: { createdAt: "desc" } },
            candidates: { take: 1, orderBy: { createdAt: "desc" } },
          },
        })

        if (dbUser) {
          const emp = dbUser.employees[0]
          const cand = dbUser.candidates[0]
          token.organizationId = emp?.organizationId || null
          token.employeeId = emp?.id || null
          token.candidateId = cand?.id || null
          token.role = emp?.role || null
          token.employeeStatus = emp?.status || null
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && (token.id || token.sub) && session.user) {
        session.user.id = (token.id || token.sub) as string
        session.user.email = (token.email || session.user.email || "") as string
        session.user.organizationId = (token.organizationId as any) || null
        session.user.employeeId = (token.employeeId as any) || null
        session.user.candidateId = (token.candidateId as any) || null
        session.user.role = (token.role as any) || null
        session.user.employeeStatus = (token.employeeStatus as any) || null
      }
      return session
    },
  },
}
