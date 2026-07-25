import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { router, protectedProcedure, adminProcedure } from "../trpc"
import { createBranchSchema, updateOrgSettingsSchema } from "@/features/organization/schemas/organization-schemas"
import { inviteEmployeeSchema } from "@/features/auth/schema/auth-schemas"
import { sendInviteEmailService } from "@/features/auth/services/auth-email.service"
import { getAppUrl } from "@/lib/utils/url-utils"
import { EmployeeRole } from "@/types/enums"
import crypto from "crypto"

export const organizationRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const { organizationId } = ctx.session.user

    if (!organizationId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not associated with an organization.",
      })
    }

    const organization = await ctx.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        branches: {
          orderBy: { createdAt: "asc" },
        },
        businessUnits: {
          orderBy: { createdAt: "asc" },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: {
            employees: true,
            jobs: true,
          },
        },
      },
    })

    if (!organization) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Organization not found.",
      })
    }

    return organization
  }),

  updateSettings: adminProcedure
    .input(updateOrgSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const { organizationId } = ctx.session.user

      if (!organizationId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No organization associated with this account." })
      }

      const updated = await ctx.prisma.organization.update({
        where: { id: organizationId },
        data: {
          name: input.name,
          domain: input.domain,
          websiteUrl: input.websiteUrl || null,
          linkedinUrl: input.linkedinUrl || null,
          dataRetentionDays: input.dataRetentionDays,
        },
      })

      return { success: true, organization: updated }
    }),

  getBranches: protectedProcedure.query(async ({ ctx }) => {
    const { organizationId } = ctx.session.user

    if (!organizationId) {
      return []
    }

    return ctx.prisma.branch.findMany({
      where: { organizationId, isActive: true },
      orderBy: [{ isHeadOffice: "desc" }, { name: "asc" }],
    })
  }),

  createBranch: adminProcedure
    .input(createBranchSchema)
    .mutation(async ({ ctx, input }) => {
      const { organizationId } = ctx.session.user

      if (!organizationId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No organization associated with user." })
      }

      // Check if code already exists in org
      const existing = await ctx.prisma.branch.findFirst({
        where: {
          organizationId,
          code: input.code.toUpperCase(),
        },
      })

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Branch with code '${input.code.toUpperCase()}' already exists.`,
        })
      }

      // If set to head office, reset any previous head office flag
      if (input.isHeadOffice) {
        await ctx.prisma.branch.updateMany({
          where: { organizationId, isHeadOffice: true },
          data: { isHeadOffice: false },
        })
      }

      // Resolve BusinessUnit
      let businessUnitId = input.businessUnitId
      if (!businessUnitId) {
        let bu = await ctx.prisma.businessUnit.findFirst({
          where: { organizationId },
        })
        if (!bu) {
          bu = await ctx.prisma.businessUnit.create({
            data: {
              organizationId,
              name: "Corporate Headquarters",
              isDefault: true,
            },
          })
        }
        businessUnitId = bu.id
      }

      // Create branch
      const branch = await ctx.prisma.branch.create({
        data: {
          organizationId,
          businessUnitId,
          name: input.name,
          code: input.code.toUpperCase(),
          city: input.city,
          country: input.country,
          timezone: input.timezone,
          address: input.address || null,
          isHeadOffice: input.isHeadOffice,
          isActive: true,
        },
      })

      // If branchAdminEmployeeId supplied, update employee role & branch scope
      if (input.branchAdminEmployeeId) {
        await ctx.prisma.employee.update({
          where: { id: input.branchAdminEmployeeId },
          data: {
            role: EmployeeRole.BRANCH_ADMIN,
            branchId: branch.id,
          },
        }).catch(() => {})
      }

      return branch
    }),

  sendInvite: protectedProcedure
    .input(inviteEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      const { organizationId, role: userRole, name: inviterName } = ctx.session.user

      if (!organizationId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No organization associated with user." })
      }

      // Check role permissions: Owner, Global Admin, BU Admin, Branch Admin, Recruiter can invite
      const allowedInviterRoles = [
        EmployeeRole.OWNER,
        EmployeeRole.GLOBAL_ADMIN,
        EmployeeRole.BUSINESS_UNIT_ADMIN,
        EmployeeRole.BRANCH_ADMIN,
        EmployeeRole.RECRUITER,
      ]

      if (!userRole || !allowedInviterRoles.includes(userRole as EmployeeRole)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to invite employees.",
        })
      }

      // Check if candidate/user exists with this email
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
        include: { employees: true, candidates: true },
      })

      if (existingUser?.employees?.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email is already an active employee of an organization.",
        })
      }

      if (existingUser?.candidates?.length) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This email is registered as a Candidate account. Employees must use separate work emails.",
        })
      }

      const org = await ctx.prisma.organization.findUnique({
        where: { id: organizationId },
      })

      if (!org) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found." })
      }

      const token = crypto.randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await ctx.prisma.employeeInvitation.create({
        data: {
          email: input.email.toLowerCase(),
          role: input.role,
          token,
          organizationId,
          businessUnitId: input.businessUnitId || null,
          branchId: input.branchId || null,
          departmentId: input.departmentId || null,
          expiresAt,
        },
      })

      const inviteLink = `${getAppUrl()}/register?inviteToken=${token}`

      await sendInviteEmailService({
        to: input.email,
        organizationName: org.name,
        role: input.role.replace(/_/g, " "),
        inviterName: inviterName || "Team Admin",
        inviteLink,
        organizationId,
      }).catch((err) => {
        console.error("Failed to send invitation email:", err)
      })

      return { success: true, message: `Invitation sent to ${input.email}` }
    }),
})
