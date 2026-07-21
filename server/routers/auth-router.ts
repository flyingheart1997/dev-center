import { z } from "zod"
import bcrypt from "bcryptjs"
import { router, publicProcedure, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { EmployeeRole, EmployeeStatus } from "@/types/enums"
import { getAppUrl } from "@/lib/utils/url-utils"
import { sendTransactionalEmail } from "@/lib/resend"
import { renderEmailVerificationTemplate } from "@/components/templates/email-templates/email-verification-template"
import { renderLoginOtpTemplate } from "@/components/templates/email-templates/login-otp-template"
import { renderPasswordResetTemplate } from "@/components/templates/email-templates/password-reset-template"
import {
  registerUserSchema,
  forgotPasswordSchema,
  setupOrgSchema,
} from "@/features/auth/schema/auth-schemas"
import { checkRateLimit } from "@/features/auth/utils/rate-limit"
import { generateAndSaveToken } from "@/features/auth/utils/token-utils"
import { isPublicEmailDomain } from "@/features/auth/utils/domain-utils"

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session
  }),

  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .query(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      await checkRateLimit(ctx.prisma, `check-email:${email}`, 5, 15 * 60 * 1000)
      const existingUser = await ctx.prisma.user.findUnique({ where: { email } })
      return { exists: !!existingUser }
    }),

  registerUser: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `register:${email}`, 3, 15 * 60 * 1000)

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email address already exists.",
        })
      }

      const passwordHash = await bcrypt.hash(input.password, 12)

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email,
          phone: input.phone || null,
          accounts: {
            create: {
              type: "credentials",
              provider: "credentials",
              providerAccountId: passwordHash,
            },
          },
        },
      })

      // Generate verification token
      const token = await generateAndSaveToken(ctx.prisma, `verify-email:${email}`, 24 * 60 * 60 * 1000)

      const appUrl = getAppUrl()
      const verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

      console.log("==================================================")
      console.log(`🔑 DEV VERIFICATION LINK FOR NEW USER [${email}]:`)
      console.log(verifyLink)
      console.log("==================================================")

      const html = renderEmailVerificationTemplate({ userName: input.name, verifyLink })
      await sendTransactionalEmail({
        to: email,
        subject: "Verify your Dev-Center Account Email",
        html,
        idempotencyKey: `verify-email/${user.id}-${Date.now()}`,
      })

      return {
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        userId: user.id,
      }
    }),

  onboardCandidate: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id

      const currentEmployee = await ctx.prisma.employee.findFirst({
        where: { userId },
      })

      if (currentEmployee) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered as an employee of an organization.",
        })
      }

      const existingCandidate = await ctx.prisma.candidate.findUnique({
        where: { userId },
      })

      if (existingCandidate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered as a candidate.",
        })
      }

      await ctx.prisma.candidate.create({
        data: {
          userId,
        },
      })

      return {
        success: true,
        message: "Candidate profile created successfully. Redirecting to candidate dashboard...",
      }
    }),

  createOrganization: protectedProcedure
    .input(setupOrgSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
      if (!user?.email || isPublicEmailDomain(user.email)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Organizations cannot be created using personal email accounts (e.g. gmail.com, outlook.com). Please sign up with your company work email.",
        })
      }

      const domain = input.domain?.trim().toLowerCase() || null

      if (domain) {
        if (isPublicEmailDomain(`test@${domain}`)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Public email domains cannot be registered as an organization domain.",
          })
        }

        const existingDomainOrg = await ctx.prisma.organization.findUnique({ where: { domain } })
        if (existingDomainOrg) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `An organization with domain '${domain}' is already registered.`,
          })
        }
      }

      const currentEmployee = await ctx.prisma.employee.findFirst({
        where: { userId },
      })

      if (currentEmployee) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered as an employee of an organization.",
        })
      }

      const currentCandidate = await ctx.prisma.candidate.findUnique({
        where: { userId },
      })

      if (currentCandidate) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered as a candidate.",
        })
      }

      const { newOrg, employee } = await ctx.prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: input.companyName.trim(),
            domain,
            websiteUrl: input.websiteUrl || null,
            linkedinUrl: input.linkedinUrl || null,
            industry: input.industry || null,
          },
        })

        const bu = await tx.businessUnit.create({
          data: {
            organizationId: org.id,
            name: "Main Operations",
          },
        })

        const branch = await tx.branch.create({
          data: {
            organizationId: org.id,
            businessUnitId: bu.id,
            name: "Headquarters",
            isHeadOffice: true,
            city: input.city || null,
            country: input.country || null,
            timezone: input.timezone,
          },
        })

        const dept = await tx.department.create({
          data: {
            organizationId: org.id,
            branchId: branch.id,
            name: "General Management",
          },
        })

        const emp = await tx.employee.create({
          data: {
            organizationId: org.id,
            businessUnitId: bu.id,
            branchId: branch.id,
            departmentId: dept.id,
            userId,
            role: EmployeeRole.OWNER,
            status: EmployeeStatus.ACTIVE,
          },
        })

        return { newOrg: org, employee: emp }
      })

      return {
        success: true,
        organizationId: newOrg.id,
        employeeId: employee.id,
        message: "Organization & Headquarters created successfully!",
      }
    }),

  sendLoginOtp: publicProcedure
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `otp:${email}`, 3, 5 * 60 * 1000)

      const user = await ctx.prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This email is not registered. Please create an account first.",
        })
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
      const identifier = `login-otp:${email}`

      await ctx.prisma.$transaction([
        ctx.prisma.verificationToken.deleteMany({ where: { identifier } }),
        ctx.prisma.verificationToken.create({
          data: { identifier, token: otpCode, expires: expiresAt },
        }),
      ])

      console.log("==================================================")
      console.log(`🔑 DEV LOGIN OTP CODE FOR [${email}]: ${otpCode}`)
      console.log("==================================================")

      const html = renderLoginOtpTemplate({ otpCode })
      const res = await sendTransactionalEmail({
        to: email,
        subject: `${otpCode} is your Dev-Center Login Code`,
        html,
        idempotencyKey: `login-otp/${user.id}-${Date.now()}`,
      })

      if (!res.success) {
        if (res.error?.includes("only send testing emails") || res.error?.includes("resend.com/domains")) {
          return {
            success: true,
            message: `OTP Code generated! (Resend Sandbox Mode: Your 6-digit OTP code [${otpCode}] is printed in your server terminal console).`,
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to send email: ${res.error}`,
        })
      }

      return { success: true, message: "A 6-digit OTP code has been sent to your email." }
    }),

  verifyEmailToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      const identifier = `verify-email:${email}`

      const record = await ctx.prisma.verificationToken.findFirst({
        where: { identifier, token: input.token },
      })

      if (!record) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification link.",
        })
      }

      if (record.expires < new Date()) {
        await ctx.prisma.verificationToken.delete({ where: { id: record.id } })
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification link has expired. Please request a new link.",
        })
      }

      await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }),
        ctx.prisma.verificationToken.delete({ where: { id: record.id } }),
      ])

      return { success: true, message: "Email verified successfully! You can now log in." }
    }),

  resendVerificationEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `resend-verify:${email}`, 3, 15 * 60 * 1000)

      const user = await ctx.prisma.user.findUnique({ where: { email } })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Your session may be invalid. Please sign out and try logging in again.",
        })
      }

      // Generate verification token
      const token = await generateAndSaveToken(ctx.prisma, `verify-email:${email}`, 24 * 60 * 60 * 1000)

      const appUrl = getAppUrl()
      const verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

      console.log("==================================================")
      console.log(`🔑 DEV VERIFICATION LINK FOR [${email}]:`)
      console.log(verifyLink)
      console.log("==================================================")

      const html = renderEmailVerificationTemplate({
        userName: user.name || "User",
        verifyLink,
      })

      const res = await sendTransactionalEmail({
        to: email,
        subject: "Verify your Dev-Center Account Email",
        html,
        idempotencyKey: `resend-verify-email/${user.id}-${Date.now()}`,
      })

      if (!res.success) {
        if (res.error?.includes("only send testing emails") || res.error?.includes("resend.com/domains")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Resend Sandbox Mode restricts email sending to the registered account owner (flyingmyheart1997@gmail.com). For testing, the verification link has been printed in your server terminal console!",
          })
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to send email: ${res.error}`,
        })
      }

      return { success: true, message: "A new verification email has been sent. Please check your inbox." }
    }),

  requestPasswordReset: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `reset:${email}`, 3, 15 * 60 * 1000)

      const user = await ctx.prisma.user.findUnique({ where: { email } })

      if (!user) {
        return { success: true, message: "If an account exists with this email, password reset instructions have been sent." }
      }

      const token = await generateAndSaveToken(ctx.prisma, `reset-password:${email}`, 60 * 60 * 1000, 32)

      const appUrl = getAppUrl()
      const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

      const html = renderPasswordResetTemplate({ userName: user.name || undefined, resetLink })
      const res = await sendTransactionalEmail({
        to: email,
        subject: "Reset your Dev-Center Password",
        html,
        idempotencyKey: `reset-password/${user.id}-${Date.now()}`,
      })

      if (!res.success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.error || "Failed to send reset email",
        })
      }

      return { success: true, message: "Password reset instructions have been sent to your email." }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      const identifier = `reset-password:${email}`

      const record = await ctx.prisma.verificationToken.findFirst({
        where: { identifier, token: input.token },
      })

      if (!record) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired reset link.",
        })
      }

      if (record.expires < new Date()) {
        await ctx.prisma.verificationToken.delete({ where: { id: record.id } })
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset link has expired. Please request a new link.",
        })
      }

      const user = await ctx.prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." })
      }

      const passwordHash = await bcrypt.hash(input.newPassword, 12)

      const existingAccount = await ctx.prisma.account.findFirst({
        where: { userId: user.id, provider: "credentials" },
      })

      await ctx.prisma.$transaction([
        existingAccount
          ? ctx.prisma.account.update({
            where: { id: existingAccount.id },
            data: { providerAccountId: passwordHash },
          })
          : ctx.prisma.account.create({
            data: {
              userId: user.id,
              type: "credentials",
              provider: "credentials",
              providerAccountId: passwordHash,
            },
          }),
        ctx.prisma.verificationToken.delete({ where: { id: record.id } }),
      ])

      return { success: true, message: "Your password has been reset successfully! You can now log in." }
    }),
})
