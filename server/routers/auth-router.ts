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
import { checkRateLimit } from "@/features/auth/utils/rate-limit"
import { generateAndSaveToken } from "@/features/auth/utils/token-utils"

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

  registerCandidate: publicProcedure
    .input(candidateRegisterSchema)
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
          candidates: {
            create: {},
          },
        },
      })

      // Generate verification token
      const token = await generateAndSaveToken(ctx.prisma, `verify-email:${email}`, 24 * 60 * 60 * 1000)

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

        if (!invitation || invitation.expiresAt < new Date()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired invitation token.",
          })
        }

        if (invitation.email.toLowerCase() !== email) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This invitation is not valid for this email address.",
          })
        }

        targetOrgId = invitation.organizationId
        inviteScope = {
          role: invitation.role as EmployeeRole,
          businessUnitId: invitation.businessUnitId,
          branchId: invitation.branchId,
          departmentId: invitation.departmentId,
          status: EmployeeStatus.ACTIVE,
        }
      }

      // Domain auto-join has been intentionally removed. Users must be explicitly invited.

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
              role: inviteScope.role ?? EmployeeRole.OWNER,
              status: inviteScope.status ?? EmployeeStatus.ACTIVE,
              businessUnitId: inviteScope.businessUnitId ?? null,
              branchId: inviteScope.branchId ?? null,
              departmentId: inviteScope.departmentId ?? null,
            },
          },
        },
      })

      // Send verification email
      const token = await generateAndSaveToken(ctx.prisma, `verify-email:${email}`, 24 * 60 * 60 * 1000)

      if (input.invitationToken) {
        await ctx.prisma.employeeInvitation.delete({
          where: { token: input.invitationToken },
        })
      }

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
        message: "Employer account created! Please check your email to verify your account.",
        userId: user.id,
      }
    }),

  createOrganization: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(2, "Company name is required"),
        domain: z.string().optional(),
        websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
        linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
        industry: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        timezone: z.string().default("UTC"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create an organization.",
        })
      }

      const userId = ctx.session.user.id
      const domain = input.domain?.trim().toLowerCase() || null

      if (domain) {
        const PUBLIC_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com"]
        if (PUBLIC_DOMAINS.includes(domain)) {
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

      if (!currentEmployee) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No initial employee profile found for the user.",
        })
      }

      // Update Organization + BusinessUnit + HQ Branch + Department
      const updatedOrg = await ctx.prisma.organization.update({
        where: { id: currentEmployee.organizationId },
        data: {
          name: input.companyName.trim(),
          domain,
          websiteUrl: input.websiteUrl || null,
          linkedinUrl: input.linkedinUrl || null,
          industry: input.industry || null,
          businessUnits: {
            create: {
              name: "Main Operations",
              branches: {
                create: {
                  name: "Headquarters",
                  isHeadOffice: true,
                  city: input.city || null,
                  country: input.country || null,
                  timezone: input.timezone,
                  organizationId: currentEmployee.organizationId,
                  departments: {
                    create: {
                      name: "General Management",
                      organizationId: currentEmployee.organizationId,
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          businessUnits: {
            include: {
              branches: {
                include: {
                  departments: true,
                },
              },
            },
          },
        },
      })

      const bu = updatedOrg.businessUnits?.[updatedOrg.businessUnits.length - 1]
      const branch = bu?.branches?.[bu.branches.length - 1]
      const dept = branch?.departments?.[branch.departments.length - 1]

      await ctx.prisma.employee.update({
        where: { id: currentEmployee.id },
        data: {
          businessUnitId: bu?.id || null,
          branchId: branch?.id || null,
          departmentId: dept?.id || null,
        },
      })

      return {
        success: true,
        organizationId: updatedOrg.id,
        employeeId: currentEmployee.id,
        message: "Organization & Headquarters updated successfully!",
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
          message: "No account found with this email address.",
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

      await ctx.prisma.$transaction([
        ctx.prisma.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        }),
        ctx.prisma.verificationToken.delete({ where: { id: record.id } }),
      ])

      return { success: true, message: "Email verified successfully! You can now log in." }
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
