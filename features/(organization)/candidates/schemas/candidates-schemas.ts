import { z } from "zod"
import { ApplicantStatus } from "@/types/enums"

export const updateApplicantStatusSchema = z.object({
  applicationId: z.string().uuid("Invalid application ID"),
  status: z.nativeEnum(ApplicantStatus),
  currentRoundId: z.string().uuid("Invalid round ID").nullable().optional(),
  rejectionReason: z.string().optional(),
  rejectionNotes: z.string().optional(),
})

export type UpdateApplicantStatusInput = z.infer<typeof updateApplicantStatusSchema>

export const getCandidatesFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(ApplicantStatus).optional(),
  departmentId: z.string().optional(),
  branchId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
})

export type GetCandidatesFilterInput = z.infer<typeof getCandidatesFilterSchema>
