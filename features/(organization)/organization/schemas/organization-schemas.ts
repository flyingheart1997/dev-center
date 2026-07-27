import { z } from "zod"
import { EmployeeRole } from "@/types/enums"

export const createBranchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().min(2, "Branch code must be at least 2 characters").optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().default("UTC"),
  address: z.string().optional(),
  isHeadOffice: z.boolean().default(false),
  businessUnitId: z.string().optional(),
  branchAdminEmployeeId: z.string().optional(),
})

export type CreateBranchInput = z.infer<typeof createBranchSchema>

export const inviteEmployeeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.nativeEnum(EmployeeRole).default(EmployeeRole.INTERVIEWER),
  businessUnitId: z.string().optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
})

export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
})

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>

export const updateOrgSettingsSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").optional(),
  domain: z.string().optional(),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  dataRetentionDays: z.number().optional(),
})

export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>
