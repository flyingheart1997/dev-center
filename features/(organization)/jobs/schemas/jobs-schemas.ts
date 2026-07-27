import { z } from "zod"
import { EmploymentType, ExperienceLevel, RemoteType, RoundCategory, JobStatus } from "@/types/enums"

export const jobRoundSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Round title must be at least 2 characters"),
  category: z.nativeEnum(RoundCategory),
  durationMinutes: z.number().min(15, "Duration must be at least 15 minutes").max(240, "Duration cannot exceed 4 hours"),
  orderIndex: z.number().min(0),
  interviewerIds: z.array(z.string()).default([]),
})

export const createJobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  businessUnitId: z.string().nullable().optional(),
  branchId: z.string().nullable().optional(),
  departmentId: z.string().nullable().optional(),
  employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  experienceLevel: z.nativeEnum(ExperienceLevel).default(ExperienceLevel.MID),
  remoteType: z.nativeEnum(RemoteType).default(RemoteType.ONSITE),
  salaryMin: z.number().min(0, "Minimum salary cannot be negative").nullable().optional(),
  salaryMax: z.number().min(0, "Maximum salary cannot be negative").nullable().optional(),
  currency: z.string().min(1).default("USD"),
  location: z.string().min(2, "Location is required"),
  isInternalOnly: z.boolean().default(false),
  skills: z.array(z.string()).min(1, "At least one skill tag is required"),
  description: z.string().min(20, "Job description must be at least 20 characters long"),
  rounds: z.array(jobRoundSchema).min(1, "At least one interview round is required"),
  status: z.nativeEnum(JobStatus).default(JobStatus.DRAFT),
})

export type CreateJobInput = z.infer<typeof createJobSchema>
export type JobRoundInput = z.infer<typeof jobRoundSchema>

export const updateJobSchema = createJobSchema.extend({
  id: z.string().uuid("Invalid job ID"),
})

export type UpdateJobInput = z.infer<typeof updateJobSchema>

export const cloneJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  newTitle: z.string().min(3, "New job title must be at least 3 characters").optional(),
})

export type CloneJobInput = z.infer<typeof cloneJobSchema>

export const closeJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
})

export type CloseJobInput = z.infer<typeof closeJobSchema>

export const getJobsFilterSchema = z.object({
  status: z.nativeEnum(JobStatus).optional(),
  businessUnitId: z.string().optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export type GetJobsFilterInput = z.infer<typeof getJobsFilterSchema>
