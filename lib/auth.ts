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
import { checkRateLimit } from "@/features/auth/utils/rate-limit"
import type { Prisma } from "@/prisma/generated/client"

type CachedJwtUser = Prisma.UserGetPayload<{
  include: {
    employees: true
    candidates: true
  }
}>

const oauthProviders: NextAuthOptions["providers"] = []

const CREDENTIAL_PROVIDER_IDS = ["credentials", "credentials-password", "credentials-otp", "credentials-autologin"]

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

const jwtUserCache = createJwtUserCache<CachedJwtUser>()

async function isOAuthRateLimited(email: string): Promise<boolean> {
  try {
    await checkRateLimit(prisma, `oauth-signin:${email.toLowerCase()}`, 10, 60 * 60 * 1000)
    return false
  } catch {
    return true
  }
}

// allowDangerousEmailAccountLinking: an existing password/OTP account has no linked OAuth
// account yet, so without this next-auth would reject the very first Google/GitHub/LinkedIn
// sign-in for that email with OAuthAccountNotLinked. Safe here because all three providers
// verify email ownership themselves before exposing it in the profile.
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
      // next-auth's built-in profile() still calls LinkedIn's deprecated REST endpoints
      // (/v2/me + /v2/emailAddress), which no longer work for apps on "Sign In with
      // LinkedIn using OpenID Connect" (the only option for new LinkedIn apps). Point it
      // at the standard OIDC userinfo endpoint instead, which returns email directly.
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

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
        }

        if (!user.hashedPassword) {
          throw new Error("Account relies on social login or OTP. Please use OTP or Google/GitHub login.")
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
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

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
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
    // Silently signs a user in right after they complete email verification, using a
    // short-lived single-use token the server hands the client in the verifyEmailToken
    // response — never typed by the user, never put in a URL. Not a general password bypass.
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

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            employees: { take: 1, orderBy: { createdAt: "desc" } },
            candidates: { take: 1, orderBy: { createdAt: "desc" } },
          },
        })

        if (!user) {
          throw new Error("Account not found.")
        }

        if (user.deletedAt) {
          throw new Error("This account has been deactivated.")
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
      if (!account || CREDENTIAL_PROVIDER_IDS.includes(account.provider)) return true
      if (!user.email) return false

      const email = user.email
      // NOTE: for a brand-new OAuth sign-up, next-auth calls this callback BEFORE the
      // adapter creates the User row, so `user.id` here is the provider's own profile id
      // (e.g. Google's `sub`), not our DB id — look up by email instead. This also means
      // rejecting a new sign-up here is enough on its own; nothing has been persisted yet,
      // so there's nothing to clean up.
      const dbUser = await prisma.user.findUnique({ where: { email } })

      if (dbUser?.deletedAt) return "/login?error=AccountDeactivated"

      const cookieStore = await cookies()
      const [mode, intent] = (cookieStore.get("__dc_auth_mode")?.value || "login").split(":")

      if (!dbUser) {
        if (mode !== "register") {
          return "/login?error=OAuthAccountNotRegistered"
        }
        if (intent === "organization" && isPublicEmailDomain(email)) {
          return "/register?error=WorkEmailRequired"
        }
        // intent === "candidate": the Candidate row is created in the jwt callback below,
        // once the adapter has actually created the User (trigger === "signUp").
      }

      if (await isOAuthRateLimited(email)) {
        return "/login?error=TooManyAttempts"
      }

      if (dbUser && !dbUser.emailVerified) {
        await prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }).catch(() => { })
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

      // trigger === "signUp" fires exactly once, right after the adapter creates a brand-new
      // OAuth user (never for credentials sign-ins). This is the earliest point where the
      // user actually has a DB row, so candidate auto-creation and email verification (OAuth
      // providers already verify email ownership themselves) for a register+* sign-up happen
      // here rather than in signIn, where the row didn't exist yet.
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

        // trigger === "update" means the client explicitly asked for a refresh (e.g. right
        // after createOrganization creates the Employee row) — a stale cache entry from
        // before that row existed would otherwise silently overwrite it straight back to
        // null a few lines down, undoing the whole point of calling update().
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
          // Not found, or soft-deleted: strip identity (including `sub`, which next-auth
          // sets independently of `id` and would otherwise keep the session alive) so
          // downstream code treats this as signed out.
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
