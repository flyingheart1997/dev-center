import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import LinkedInProvider from "next-auth/providers/linkedin"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { createJwtUserCache } from "@/lib/utils/auth-cache"
import { isPublicEmailDomain } from "@/features/auth/utils/domain-utils"
import {
  checkAndIncrementFailedLogins,
  clearFailedLogins,
  isOAuthRateLimited,
} from "@/features/auth/utils/rate-limit"
import {
  fetchUserWithProfilesByEmail,
  buildSessionUserPayload,
} from "@/features/auth/utils/auth-helpers"
import type { Prisma } from "@/prisma/generated/client"

type CachedJwtUser = Prisma.UserGetPayload<{
  include: {
    employees: true
    candidates: true
  }
}>

const oauthProviders: NextAuthOptions["providers"] = []

const CREDENTIAL_PROVIDER_IDS = ["credentials", "credentials-password", "credentials-otp", "credentials-autologin"]

const jwtUserCache = createJwtUserCache<CachedJwtUser>()

if (process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
      allowDangerousEmailAccountLinking: true,
    })
  )
}

if (process.env.GITHUB_CLIENT_ID?.trim() && process.env.GITHUB_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID.trim(),
      clientSecret: process.env.GITHUB_CLIENT_SECRET.trim(),
      allowDangerousEmailAccountLinking: true,
    })
  )
}

if (process.env.LINKEDIN_CLIENT_ID?.trim() && process.env.LINKEDIN_CLIENT_SECRET?.trim()) {
  oauthProviders.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID.trim(),
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET.trim(),
      allowDangerousEmailAccountLinking: true,
      userinfo: "https://api.linkedin.com/v2/userinfo",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
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

        await checkAndIncrementFailedLogins(prisma, email)

        const user = await fetchUserWithProfilesByEmail(email)

        if (!user) {
          throw new Error("This email is not registered. Please create an account first.")
        }

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
        }

        const passwordHash = user.hashedPassword
        if (!passwordHash) {
          throw new Error("Account relies on social login or OTP. Please use OTP or Google/GitHub/LinkedIn login.")
        }

        const isValidPassword = await bcrypt.compare(credentials.password, passwordHash)
        if (!isValidPassword) {
          throw new Error("Invalid password")
        }

        await clearFailedLogins(prisma, email)

        return buildSessionUserPayload(user as any)
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

        await checkAndIncrementFailedLogins(prisma, email)

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

        await clearFailedLogins(prisma, email)

        const user = await fetchUserWithProfilesByEmail(email)

        if (!user) {
          throw new Error("This email is not registered. Please create an account first.")
        }

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
        }

        return buildSessionUserPayload(user as any)
      },
    }),
    CredentialsProvider({
      id: "credentials-autologin",
      name: "Auto Login",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.token) {
          throw new Error("Invalid sign-in request.")
        }

        const email = credentials.email.toLowerCase()
        const identifier = `auto-login:${email}`

        const record = await prisma.verificationToken.findFirst({
          where: { identifier, token: credentials.token },
        })

        if (!record) {
          throw new Error("This sign-in link has expired. Please log in manually.")
        }

        await prisma.verificationToken.delete({ where: { id: record.id } }).catch(() => {})

        if (record.expires < new Date()) {
          throw new Error("This sign-in link has expired. Please log in manually.")
        }

        const user = await fetchUserWithProfilesByEmail(email)

        if (!user) {
          throw new Error("Account not found.")
        }

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
        }

        return buildSessionUserPayload(user as any)
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || CREDENTIAL_PROVIDER_IDS.includes(account.provider)) return true
      if (!user.email) return false

      const email = user.email
      const dbUser = await prisma.user.findUnique({ where: { email } })

      if (dbUser?.deletedAt) return "/login?error=AccountDeactivated"

      const cookieStore = await cookies()
      const modeCookie = cookieStore.get("__dc_auth_mode")?.value || "login"
      const [mode, intent] = modeCookie.split(":")

      // Audit Fix 3: Stale cookie cleanup (expire cookie after reading)
      try {
        cookieStore.delete("__dc_auth_mode")
        cookieStore.delete("__dc_auth_name")
      } catch {
        // Ignore if immutable in context
      }

      if (!dbUser) {
        if (mode !== "register") {
          return "/login?error=OAuthAccountNotRegistered"
        }
        if (intent === "organization" && isPublicEmailDomain(email)) {
          return "/register?error=WorkEmailRequired"
        }
      }

      if (await isOAuthRateLimited(prisma, email)) {
        return "/login?error=TooManyAttempts"
      }

      if (dbUser && !dbUser.emailVerified) {
        await prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }).catch(() => {})
      }

      return true
    },
    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.id = user.id
        token.email = user.email!
        token.organizationId = (user as any).organizationId
        token.employeeId = (user as any).employeeId
        token.candidateId = (user as any).candidateId
        token.role = (user as any).role
        token.employeeStatus = (user as any).employeeStatus
      }

      if (trigger === "signUp" && user?.id) {
        const cookieStore = await cookies()
        const [, intent] = (cookieStore.get("__dc_auth_mode")?.value || "").split(":")
        if (intent === "candidate") {
          await prisma.candidate.create({ data: { userId: user.id } }).catch(() => {})
        }
        await prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } }).catch(() => {})
      }

      if (token.id || token.sub) {
        const userId = (token.id || token.sub) as string
        const cacheKey = `user:${userId}`

        if (trigger === "update") {
          jwtUserCache.delete(cacheKey)
        }

        let dbUser = jwtUserCache.get(cacheKey)
        if (!dbUser) {
          dbUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              employees: { take: 1, orderBy: { createdAt: "desc" } },
              candidates: { take: 1, orderBy: { createdAt: "desc" } },
            },
          })
          if (dbUser) jwtUserCache.set(cacheKey, dbUser)
        }

        if (dbUser && !dbUser.deletedAt) {
          token.id = dbUser.id
          token.email = dbUser.email!

          const emp = dbUser.employees[0]
          const cand = dbUser.candidates[0]
          token.organizationId = emp?.organizationId || null
          token.employeeId = emp?.id || null
          token.candidateId = cand?.id || null
          token.role = emp?.role || null
          token.employeeStatus = emp?.status || null
          token.emailVerified = dbUser.emailVerified ? dbUser.emailVerified.toISOString() : null
        } else {
          jwtUserCache.delete(cacheKey)
          token.id = null as any
          token.sub = undefined
          token.email = null as any
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
