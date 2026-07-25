import { z } from "zod"
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from "../utils/password-utils"

export const registerUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    intent: z.enum(["candidate", "organization"]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    phone: z.string().optional(),
    inviteToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const setupOrgSchema = z.object({
  companyName: z.string().min(2, "Company Name is required"),
  domain: z
    .string()
    .min(3, "Domain is required")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i,
      "Enter a valid domain, e.g. acme.com"
    ),
  websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  industry: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().default("UTC"),
})

export const loginOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otpCode: z.string().length(6, "OTP code must be 6 digits").optional(),
})

export const loginPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    email: z.string().email("Invalid email address"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const inviteEmployeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["Owner", "Global_Admin", "Business_Unit_Admin", "Branch_Admin", "Recruiter", "Interviewer", "Hiring_Manager"]),
  businessUnitId: z.string().optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type SetupOrgInput = z.infer<typeof setupOrgSchema>
export type LoginOtpInput = z.infer<typeof loginOtpSchema>
export type LoginPasswordInput = z.infer<typeof loginPasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
