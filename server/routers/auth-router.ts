import { z } from "zod"
import bcrypt from "bcryptjs"
import { crypto } from "next/dist/compiled/@edge-runtime/primitives"
import { EmployeeRole, EmployeeStatus } from "@/types/enums"
import { router, publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { getAppUrl } from "@/lib/utils/url-utils"
import { sendTransactionalEmail } from "@/lib/resend"
import { renderEmailVerificationTemplate } from "@/components/templates/email-templates/email-verification-template"
import { renderLoginOtpTemplate } from "@/components/templates/email-templates/login-otp-template"
import { renderPasswordResetTemplate } from "@/components/templates/email-templates/password-reset-template"
import {
  candidateRegisterSchema,
  employeeRegisterSchema,
  forgotPasswordSchema,
} from "@/features/auth/schema/auth-schemas"

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session
  }),

  registerCandidate: publicProcedure
    .input(candidateRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

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
          accounts: {
            create: {
              type: "credentials",
              provider: "credentials",
              providerAccountId: passwordHash,
            },
          },
          candidates: {
            create: {
              name: input.name,
              email,
              phone: input.phone,
            },
          },
        },
      })

      // Generate verification token
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const identifier = `verify-email:${email}`

      await ctx.prisma.verificationToken.deleteMany({ where: { identifier } })
      await ctx.prisma.verificationToken.create({
        data: { identifier, token, expires: expiresAt },
      })

      const appUrl = getAppUrl()
      const verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

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

  registerEmployee: publicProcedure
    .input(employeeRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

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

      let targetOrgId = input.organizationId
      let inviteScope: {
        role?: EmployeeRole
        status?: EmployeeStatus
        businessUnitId?: string | null
        branchId?: string | null
        departmentId?: string | null
      } = {}

      if (input.invitationToken) {
        const invitation = await ctx.prisma.employeeInvitation.findUnique({
          where: { token: input.invitationToken },
        })

        if (invitation && invitation.expiresAt > new Date()) {
          targetOrgId = invitation.organizationId
          inviteScope = {
            role: invitation.role as EmployeeRole,
            businessUnitId: invitation.businessUnitId,
            branchId: invitation.branchId,
            departmentId: invitation.departmentId,
            status: EmployeeStatus.ACTIVE,
          }
        }
      }

      if (!targetOrgId && email.includes("@")) {
        const emailDomain = email.split("@")[1]
        const matchingOrg = await ctx.prisma.organization.findUnique({
          where: { domain: emailDomain },
        })
        if (matchingOrg) {
          targetOrgId = matchingOrg.id
        }
      }

      if (!targetOrgId) {
        const companyName = input.name + "'s Organization"
        const newOrg = await ctx.prisma.organization.create({
          data: { name: companyName },
        })
        targetOrgId = newOrg.id
        inviteScope = { role: EmployeeRole.OWNER, status: EmployeeStatus.ACTIVE }
      }

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email,
          accounts: {
            create: {
              type: "credentials",
              provider: "credentials",
              providerAccountId: passwordHash,
            },
          },
          employees: {
            create: {
              organizationId: targetOrgId,
              role: inviteScope.role ?? EmployeeRole.INTERVIEWER,
              status: inviteScope.status ?? EmployeeStatus.PENDING_APPROVAL,
              businessUnitId: inviteScope.businessUnitId ?? null,
              branchId: inviteScope.branchId ?? null,
              departmentId: inviteScope.departmentId ?? null,
            },
          },
        },
      })

      // Send verification email
      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
      const identifier = `verify-email:${email}`

      await ctx.prisma.verificationToken.deleteMany({ where: { identifier } })
      await ctx.prisma.verificationToken.create({
        data: { identifier, token, expires: expiresAt },
      })

      const appUrl = getAppUrl()
      const verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

      const html = renderEmailVerificationTemplate({ userName: input.name, verifyLink })
      await sendTransactionalEmail({
        to: email,
        subject: "Verify your Dev-Center Account Email",
        html,
        idempotencyKey: `verify-email/${user.id}-${Date.now()}`,
      })

      return {
        success: true,
        message: "Employee account created! Please check your email to verify your account.",
        userId: user.id,
      }
    }),

  sendLoginOtp: publicProcedure
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      const user = await ctx.prisma.user.findUnique({ where: { email } })
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with this email address.",
        })
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
      const identifier = `login-otp:${email}`

      await ctx.prisma.verificationToken.deleteMany({ where: { identifier } })
      await ctx.prisma.verificationToken.create({
        data: { identifier, token: otpCode, expires: expiresAt },
      })

      const html = renderLoginOtpTemplate({ otpCode })
      const res = await sendTransactionalEmail({
        to: email,
        subject: `${otpCode} is your Dev-Center Login Code`,
        html,
        idempotencyKey: `login-otp/${user.id}-${Date.now()}`,
      })

      if (!res.success) {
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

      await ctx.prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      })

      await ctx.prisma.verificationToken.delete({ where: { id: record.id } })

      return { success: true, message: "Email verified successfully! You can now log in." }
    }),

  requestPasswordReset: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      const user = await ctx.prisma.user.findUnique({ where: { email } })

      if (!user) {
        return { success: true, message: "If an account exists with this email, password reset instructions have been sent." }
      }

      const token = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      const identifier = `reset-password:${email}`

      await ctx.prisma.verificationToken.deleteMany({ where: { identifier } })
      await ctx.prisma.verificationToken.create({
        data: { identifier, token, expires: expiresAt },
      })

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

      if (existingAccount) {
        await ctx.prisma.account.update({
          where: { id: existingAccount.id },
          data: { providerAccountId: passwordHash },
        })
      } else {
        await ctx.prisma.account.create({
          data: {
            userId: user.id,
            type: "credentials",
            provider: "credentials",
            providerAccountId: passwordHash,
          },
        })
      }

      await ctx.prisma.verificationToken.delete({ where: { id: record.id } })

      return { success: true, message: "Your password has been reset successfully! You can now log in." }
    }),
})
