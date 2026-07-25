import { z } from "zod"

export const createBranchSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters"),
  code: z.string().min(2, "Branch code is required (e.g. BOM-01)").max(10, "Branch code max 10 characters"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  timezone: z.string().default("UTC"),
  address: z.string().optional(),
  isHeadOffice: z.boolean().default(false),
  businessUnitId: z.string().optional(),
  branchAdminEmployeeId: z.string().optional(),
})

export const updateOrgSettingsSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  domain: z
    .string()
    .min(3, "Domain is required")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i,
      "Enter a valid domain, e.g. acme.com"
    ),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  dataRetentionDays: z.number().int().min(30, "Minimum data retention is 30 days").max(3650, "Maximum data retention is 10 years").default(365),
})

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
})

export type CreateBranchInput = z.infer<typeof createBranchSchema>
export type UpdateOrgSettingsInput = z.infer<typeof updateOrgSettingsSchema>
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
