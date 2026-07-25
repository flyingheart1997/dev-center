import { z } from "zod"
import bcrypt from "bcryptjs"
import { router, publicProcedure, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { EmployeeRole, EmployeeStatus } from "@/types/enums"
import { getAppUrl } from "@/lib/utils/url-utils"
import {
  registerUserSchema,
  forgotPasswordSchema,
  setupOrgSchema,
  resetPasswordSchema,
  inviteEmployeeSchema,
  changePasswordSchema,
} from "@/features/auth/schema/auth-schemas"
import { checkRateLimit } from "@/features/auth/utils/rate-limit"
import { generateAndSaveToken } from "@/features/auth/utils/token-utils"
import { isPublicEmailDomain } from "@/features/auth/utils/domain-utils"
import {
  VERIFY_EMAIL_PREFIX,
  buildVerifyIdentifier,
  parseVerifyIdentifier,
} from "@/features/auth/utils/verify-identifier"
import {
  sendVerificationEmailService,
  sendLoginOtpEmailService,
  sendPasswordResetEmailService,
  sendInviteEmailService,
} from "@/features/auth/services/auth-email.service"
import { requireOrgAdmin, acceptEmployeeInvitation } from "@/features/auth/services/invite.service"
import { jwtUserCache } from "@/lib/auth"

export const authRouter = router({
  getSession: publicProcedure.query(async ({ ctx }) => {
    return ctx.session
  }),

  checkEmailExists: publicProcedure
    .input(z.object({ email: z.string().email("Invalid email address") }))
    .query(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      await checkRateLimit(ctx.prisma, `check-email:${email}`, 20, 15 * 60 * 1000)
      const existingUser = await ctx.prisma.user.findUnique({ where: { email } })
      return { exists: !!existingUser }
    }),

  registerUser: publicProcedure
    .input(registerUserSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `register:${email}`, 3, 15 * 60 * 1000)

      if (input.intent === "organization" && isPublicEmailDomain(email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organizations cannot be created using personal email accounts (e.g. gmail.com, outlook.com). Please sign up with your company work email.",
        })
      }

      const existingUser = await ctx.prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email address already exists.",
        })
      }

      const hashedPassword = await bcrypt.hash(input.password, 12)

      let user
      try {
        user = await ctx.prisma.user.create({
          data: {
            name: input.name,
            email,
            phone: input.phone || null,
            hashedPassword,
          },
        })
      } catch (err: any) {
        if (err?.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email address already exists.",
          })
        }
        throw err
      }

      const identifier = buildVerifyIdentifier(input.intent, email)
      const token = await generateAndSaveToken(ctx.prisma, identifier, 24 * 60 * 60 * 1000)

      const appUrl = getAppUrl()
      let verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`
      if (input.inviteToken) {
        verifyLink += `&inviteToken=${encodeURIComponent(input.inviteToken)}`
      }

      const emailResult = await sendVerificationEmailService({
        email,
        userName: input.name,
        verifyLink,
        userId: user.id,
      })

      return {
        success: true,
        message: emailResult.message,
        userId: user.id,
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

      const domain = input.domain.trim().toLowerCase()

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

      const slug = domain.split(".")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-")

      const [currentEmployee, currentCandidate] = await Promise.all([
        ctx.prisma.employee.findFirst({ where: { userId } }),
        ctx.prisma.candidate.findUnique({ where: { userId } }),
      ])

      if (currentEmployee) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already registered as an employee of an organization.",
        })
      }

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
            slug,
            websiteUrl: input.websiteUrl || null,
            linkedinUrl: input.linkedinUrl || null,
            industry: input.industry || null,
          },
        })

        const bu = await tx.businessUnit.create({
          data: {
            organizationId: org.id,
            name: "Main Operations",
            isDefault: true,
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

      const result = await sendLoginOtpEmailService({ email, otpCode, userId: user.id })
      return { success: true, message: result.message }
    }),

  verifyEmailToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
        inviteToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      const record = await ctx.prisma.verificationToken.findUnique({ where: { token: input.token } })

      if (!record) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification link.",
        })
      }

      const parsed = parseVerifyIdentifier(record.identifier)
      if (!parsed || parsed.email !== email) {
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

      const [user] = await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }),
        ctx.prisma.verificationToken.delete({ where: { id: record.id } }),
      ])

      if (input.inviteToken) {
        await acceptEmployeeInvitation(ctx.prisma, { token: input.inviteToken, email, userId: user.id })
        const autoLoginToken = await generateAndSaveToken(ctx.prisma, `auto-login:${email}`, 60 * 1000)
        return { success: true, intent: "employee-invite" as const, autoLoginToken, message: "Email verified! You've joined the organization." }
      }

      if (parsed.intent === "candidate") {
        await ctx.prisma.candidate.create({ data: { userId: user.id } }).catch(() => {})
        const autoLoginToken = await generateAndSaveToken(ctx.prisma, `auto-login:${email}`, 60 * 1000)
        return { success: true, intent: "candidate" as const, autoLoginToken, message: "Email verified successfully!" }
      }

      const autoLoginToken = await generateAndSaveToken(ctx.prisma, `auto-login:${email}`, 60 * 1000)
      return { success: true, intent: "organization" as const, autoLoginToken, message: "Email verified successfully!" }
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

      const priorRecord = await ctx.prisma.verificationToken.findFirst({
        where: { identifier: { startsWith: VERIFY_EMAIL_PREFIX, endsWith: `:${email}` } },
      })
      const intent = (priorRecord && parseVerifyIdentifier(priorRecord.identifier)?.intent) || "candidate"

      const identifier = buildVerifyIdentifier(intent, email)
      const token = await generateAndSaveToken(ctx.prisma, identifier, 24 * 60 * 60 * 1000)

      const appUrl = getAppUrl()
      const verifyLink = `${appUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`

      const result = await sendVerificationEmailService({
        email,
        userName: user.name || "User",
        verifyLink,
        userId: user.id,
      })

      return { success: true, message: result.message || "A new verification email has been sent. Please check your inbox." }
    }),

  requestPasswordReset: publicProcedure
    .input(forgotPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `reset:${email}`, 3, 15 * 60 * 1000)

      const user = await ctx.prisma.user.findUnique({ where: { email } })

      if (!user || user.deletedAt) {
        return { success: true, message: "If an account exists with this email, password reset instructions have been sent." }
      }

      const token = await generateAndSaveToken(ctx.prisma, `reset-password:${email}`, 60 * 60 * 1000, 32)

      const appUrl = getAppUrl()
      const resetLink = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

      const result = await sendPasswordResetEmailService({
        email,
        userName: user.name || "User",
        resetLink,
        userId: user.id,
      })

      return { success: true, message: result.message || "Password reset instructions have been sent to your email." }
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
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

      if (user.deletedAt) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This account has been deactivated." })
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12)

      await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { email },
          data: {
            hashedPassword,
            lastPasswordChangedAt: new Date(),
            tokenVersion: { increment: 1 },
          },
        }),
        ctx.prisma.verificationToken.delete({ where: { id: record.id } }),
        ctx.prisma.auditLog.create({
          data: {
            userId: user.id,
            event: "PASSWORD_CHANGED",
            action: "PASSWORD_RESET",
            entityName: "User",
            entityId: user.id,
          },
        }),
      ])

      // Bust JWT cache so next token refresh picks up new tokenVersion
      await jwtUserCache.delete(`user:${user.id}`)
      await jwtUserCache.delete(`user:${user.id}:${user.tokenVersion}`)

      return { success: true, message: "Your password has been reset successfully! You can now log in." }
    }),

  inviteEmployee: protectedProcedure
    .input(inviteEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      requireOrgAdmin(ctx.session.user)
      const organizationId = ctx.session.user.organizationId!
      const email = input.email.trim().toLowerCase()

      await checkRateLimit(ctx.prisma, `invite-employee:${ctx.session.user.id}`, 20, 60 * 60 * 1000)

      const [organization, existingUser] = await Promise.all([
        ctx.prisma.organization.findUniqueOrThrow({ where: { id: organizationId } }),
        ctx.prisma.user.findUnique({ where: { email }, include: { employees: { where: { organizationId } } } }),
      ])

      if (existingUser?.employees.length) {
        throw new TRPCError({ code: "CONFLICT", message: "This person is already a member of your organization." })
      }

      const token = crypto.randomUUID().replace(/-/g, "")
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      await ctx.prisma.employeeInvitation.deleteMany({ where: { email, organizationId } })
      await ctx.prisma.employeeInvitation.create({
        data: {
          email,
          role: input.role,
          organizationId,
          businessUnitId: input.businessUnitId,
          branchId: input.branchId,
          departmentId: input.departmentId,
          token,
          expiresAt,
        },
      })

      const appUrl = getAppUrl()
      const inviteLink = `${appUrl}/register?inviteToken=${token}`

      await sendInviteEmailService({
        to: email,
        organizationName: organization.name,
        role: input.role,
        inviterName: ctx.session.user.name || "A teammate",
        inviteLink,
        organizationId,
      })

      return { success: true, message: `Invitation sent to ${email}.` }
    }),

  getInviteDetails: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.prisma.employeeInvitation.findUnique({
        where: { token: input.token },
        include: { organization: { select: { name: true } } },
      })

      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "This invitation link is invalid." })
      }

      if (invite.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This invitation has expired." })
      }

      return {
        email: invite.email,
        role: invite.role,
        organizationName: invite.organization.name,
        expiresAt: invite.expiresAt,
      }
    }),

  acceptInvite: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const email = ctx.session.user.email
      if (!email) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Your account has no email on file." })
      }
      await acceptEmployeeInvitation(ctx.prisma, { token: input.token, email, userId: ctx.session.user.id })
      return { success: true, message: "You've joined the organization." }
    }),

  revokeInvite: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.prisma.employeeInvitation.findUnique({ where: { token: input.token } })
      if (!invite) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found." })
      }
      requireOrgAdmin(ctx.session.user, invite.organizationId)
      await ctx.prisma.employeeInvitation.delete({ where: { id: invite.id } })
      return { success: true, message: "Invitation revoked." }
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      await checkRateLimit(ctx.prisma, `change-password:${userId}`, 5, 15 * 60 * 1000)

      const user = await ctx.prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." })
      }

      if (!user.hashedPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your account relies on social login or OTP. Directly setting a password is not supported for this account type.",
        })
      }

      const isValidPassword = await bcrypt.compare(input.currentPassword, user.hashedPassword)
      if (!isValidPassword) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Incorrect current password." })
      }

      const newHashedPassword = await bcrypt.hash(input.newPassword, 12)
      const now = new Date()

      await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { id: userId },
          data: {
            hashedPassword: newHashedPassword,
            lastPasswordChangedAt: now,
            tokenVersion: { increment: 1 },
          },
        }),
        ctx.prisma.auditLog.create({
          data: {
            userId: user.id,
            organizationId: ctx.session.user.organizationId || null,
            employeeId: ctx.session.user.employeeId || null,
            event: "PASSWORD_CHANGED",
            action: "PASSWORD_CHANGED",
            entityName: "User",
            entityId: user.id,
          },
        }),
      ])

      await jwtUserCache.delete(`user:${userId}`)
      await jwtUserCache.delete(`user:${userId}:${user.tokenVersion}`)

      return { success: true, message: "Password updated successfully." }
    }),

  getActiveSessions: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const sessions = await ctx.prisma.session.findMany({
      where: { userId, revokedAt: null, expires: { gt: new Date() } },
      orderBy: { lastSeenAt: "desc" },
    })

    return sessions.map((s) => ({
      id: s.id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
    }))
  }),

  revokeSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const sessionToRevoke = await ctx.prisma.session.findUnique({ where: { id: input.sessionId } })

      if (!sessionToRevoke || sessionToRevoke.userId !== userId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found." })
      }

      await ctx.prisma.$transaction([
        ctx.prisma.session.update({
          where: { id: input.sessionId },
          data: { revokedAt: new Date() },
        }),
        ctx.prisma.auditLog.create({
          data: {
            userId,
            organizationId: ctx.session.user.organizationId || null,
            employeeId: ctx.session.user.employeeId || null,
            event: "SESSION_REVOKED",
            action: "SESSION_REVOKED",
            entityName: "Session",
            entityId: input.sessionId,
          },
        }),
      ])

      return { success: true, message: "Session revoked successfully." }
    }),

  revokeOtherSessions: protectedProcedure
    .input(z.object({ currentSessionToken: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const whereCondition = input.currentSessionToken
        ? { userId, revokedAt: null, NOT: { sessionToken: input.currentSessionToken } }
        : { userId, revokedAt: null }

      await ctx.prisma.$transaction([
        ctx.prisma.session.updateMany({
          where: whereCondition,
          data: { revokedAt: new Date() },
        }),
        ctx.prisma.auditLog.create({
          data: {
            userId,
            organizationId: ctx.session.user.organizationId || null,
            employeeId: ctx.session.user.employeeId || null,
            event: "SESSION_REVOKED",
            action: "SESSION_REVOKED_OTHER_DEVICES",
            entityName: "User",
            entityId: userId,
          },
        }),
      ])

      return { success: true, message: "All other sessions have been revoked successfully." }
    }),
})
