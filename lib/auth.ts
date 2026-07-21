import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import LinkedInProvider from "next-auth/providers/linkedin"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const oauthProviders: NextAuthOptions["providers"] = []

const MAX_FAILED_ATTEMPTS = 4
const LOCKOUT_DURATION_MS = 60 * 60 * 1000 // 1 hour

async function checkAndIncrementFailedLogins(email: string) {
  const key = `failed-login:${email.toLowerCase()}`
  const now = new Date()

  const existing = await prisma.rateLimit.findUnique({ where: { key } })

  if (existing) {
    if (existing.expiresAt < now) {
      await prisma.rateLimit.update({
        where: { key },
        data: { points: 1, expiresAt: new Date(now.getTime() + LOCKOUT_DURATION_MS) },
      })
      return
    }

    if (existing.points >= MAX_FAILED_ATTEMPTS) {
      throw new Error("Too many failed attempts. Your account has been temporarily locked for 1 hour.")
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { points: { increment: 1 } },
    })
  } else {
    await prisma.rateLimit.create({
      data: {
        key,
        points: 1,
        expiresAt: new Date(now.getTime() + LOCKOUT_DURATION_MS),
      },
    })
  }
}

async function clearFailedLogins(email: string) {
  const key = `failed-login:${email.toLowerCase()}`
  try {
    await prisma.rateLimit.delete({ where: { key } })
  } catch (e) {
    // Ignore if not found
  }
}

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

        const email = credentials.email.toLowerCase()

        // Check rate limit first
        await checkAndIncrementFailedLogins(email)

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
          throw new Error("This email is not registered. Please create an account first.")
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

        await clearFailedLogins(email)

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

        // Check rate limit first
        await checkAndIncrementFailedLogins(email)

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
        
        await clearFailedLogins(email)

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
          throw new Error("This email is not registered. Please create an account first.")
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
    async signIn({ user, account }) {
      if (account?.provider && account.provider !== "credentials" && account.provider !== "credentials-otp") {
        if (!user.email) return false

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        if (existingUser && !existingUser.emailVerified) {
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          })
        }
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user || trigger === "update") {
        if (user) {
          token.id = user.id
          token.email = user.email!
          token.organizationId = (user as any).organizationId
          token.employeeId = (user as any).employeeId
          token.candidateId = (user as any).candidateId
          token.role = (user as any).role
          token.employeeStatus = (user as any).employeeStatus
        }

        if (trigger === "update" && session) {
          if (session.organizationId !== undefined) token.organizationId = session.organizationId
          if (session.employeeId !== undefined) token.employeeId = session.employeeId
          if (session.candidateId !== undefined) token.candidateId = session.candidateId
          if (session.role !== undefined) token.role = session.role
          if (session.employeeStatus !== undefined) token.employeeStatus = session.employeeStatus
        }

        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
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
            token.emailVerified = dbUser.emailVerified ? dbUser.emailVerified.toISOString() : null
          } else {
            token.id = null as any
            token.email = null as any
          }
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
        session.user.emailVerified = (token.emailVerified as any) || null
      }
      return session
    },
  },
}
