import { router, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { EmployeeRole, JobStatus, ApprovalStatus } from "@/types/enums"
import {
  createJobSchema,
  updateJobSchema,
  cloneJobSchema,
  closeJobSchema,
  getJobsFilterSchema,
} from "@/features/(organization)/jobs/schemas/jobs-schemas"

export const jobsRouter = router({
  /**
   * Get list of jobs with filters, counts, and search
   */
  list: protectedProcedure
    .input(getJobsFilterSchema)
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const role = session.user.role as EmployeeRole
      const isBUAdmin = role === EmployeeRole.BUSINESS_UNIT_ADMIN
      const isBranchAdmin = role === EmployeeRole.BRANCH_ADMIN

      // Role-scoped filter
      const where: any = { organizationId }

      if (input.status) {
        where.status = input.status
      }

      if (input.businessUnitId) {
        where.businessUnitId = input.businessUnitId
      } else if (isBUAdmin && session.user.businessUnitId) {
        where.businessUnitId = session.user.businessUnitId
      }

      if (input.branchId) {
        where.branchId = input.branchId
      } else if (isBranchAdmin && session.user.branchId) {
        where.branchId = session.user.branchId
      }

      if (input.departmentId) {
        where.departmentId = input.departmentId
      }

      if (input.search && input.search.trim().length > 0) {
        const query = input.search.trim()
        where.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { location: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ]
      }

      const [jobs, totalCount, statusCounts] = await Promise.all([
        prisma.job.findMany({
          where,
          include: {
            department: { select: { id: true, name: true } },
            branch: { select: { id: true, name: true } },
            businessUnit: { select: { id: true, name: true } },
            skills: {
              include: {
                skill: { select: { id: true, name: true } },
              },
            },
            rounds: {
              select: { id: true, title: true, category: true, orderIndex: true },
              orderBy: { orderIndex: "asc" },
            },
            _count: {
              select: {
                applications: true,
                rounds: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.job.count({ where }),
        prisma.job.groupBy({
          by: ["status"],
          where: { organizationId },
          _count: { status: true },
        }),
      ])

      const metrics = {
        total: statusCounts.reduce((acc, curr) => acc + curr._count.status, 0),
        active: statusCounts.find((s) => s.status === JobStatus.ACTIVE)?._count.status || 0,
        draft: statusCounts.find((s) => s.status === JobStatus.DRAFT)?._count.status || 0,
        pendingApproval:
          statusCounts.find((s) => s.status === JobStatus.PENDING_APPROVAL)?._count.status || 0,
        completed:
          statusCounts.find((s) => s.status === JobStatus.COMPLETED)?._count.status || 0,
      }

      return {
        jobs,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / input.limit),
          currentPage: input.page,
        },
        metrics,
      }
    }),

  /**
   * Get full details of a single job requisition
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const job = await prisma.job.findFirst({
        where: { id: input.id, organizationId },
        include: {
          department: true,
          branch: true,
          businessUnit: true,
          skills: {
            include: {
              skill: true,
            },
          },
          rounds: {
            include: {
              interviewers: {
                include: {
                  employee: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          name: true,
                          email: true,
                          image: true,
                        },
                      },
                    },
                  },
                },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
          approvals: {
            include: {
              approver: {
                include: {
                  user: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      })

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job requisition not found.",
        })
      }

      return job
    }),

  /**
   * Create a new Job Requisition with skills, multi-rounds, and approval routing
   */
  create: protectedProcedure
    .input(createJobSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId
      const role = session.user.role as EmployeeRole

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const isOwnerOrAdmin =
        role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN

      // Determine final status
      let finalStatus: JobStatus = input.status
      if (input.status === JobStatus.ACTIVE) {
        if (!isOwnerOrAdmin) {
          // Recruiters submitting for active must go through approval first
          finalStatus = JobStatus.PENDING_APPROVAL
        }
      }

      const publishedAt = finalStatus === JobStatus.ACTIVE ? new Date() : null

      return await prisma.$transaction(async (tx) => {
        // 1. Create Job record
        const job = await tx.job.create({
          data: {
            organizationId,
            businessUnitId: input.businessUnitId || null,
            branchId: input.branchId || null,
            departmentId: input.departmentId || null,
            title: input.title,
            description: input.description,
            employmentType: input.employmentType,
            experienceLevel: input.experienceLevel,
            remoteType: input.remoteType,
            salaryMin: input.salaryMin,
            salaryMax: input.salaryMax,
            currency: input.currency,
            location: input.location,
            isInternalOnly: input.isInternalOnly,
            status: finalStatus,
            publishedAt,
          },
        })

        // 2. Process skills (upsert skills & link to job)
        if (input.skills && input.skills.length > 0) {
          for (const skillName of input.skills) {
            const trimmed = skillName.trim()
            if (!trimmed) continue

            const skill = await tx.skill.upsert({
              where: { name: trimmed },
              create: { name: trimmed },
              update: {},
            })

            await tx.jobSkill.create({
              data: {
                jobId: job.id,
                skillId: skill.id,
              },
            })
          }
        }

        // 3. Process interview rounds & interviewers
        if (input.rounds && input.rounds.length > 0) {
          for (let index = 0; index < input.rounds.length; index++) {
            const roundInput = input.rounds[index]
            const round = await tx.jobRound.create({
              data: {
                jobId: job.id,
                orderIndex: index,
                title: roundInput.title,
                category: roundInput.category,
                durationMinutes: roundInput.durationMinutes,
              },
            })

            if (roundInput.interviewerIds && roundInput.interviewerIds.length > 0) {
              for (const empId of roundInput.interviewerIds) {
                await tx.jobRoundInterviewer.create({
                  data: {
                    roundId: round.id,
                    employeeId: empId,
                  },
                })
              }
            }
          }
        }

        // 4. Create JobApproval entries if PENDING_APPROVAL
        if (finalStatus === JobStatus.PENDING_APPROVAL) {
          const admins = await tx.employee.findMany({
            where: {
              organizationId,
              role: { in: [EmployeeRole.OWNER, EmployeeRole.GLOBAL_ADMIN] },
            },
            select: { id: true },
          })

          for (const admin of admins) {
            await tx.jobApproval.create({
              data: {
                jobId: job.id,
                approverId: admin.id,
                status: ApprovalStatus.PENDING,
              },
            })
          }
        }

        return job
      })
    }),

  /**
   * Update an existing job requisition
   */
  update: protectedProcedure
    .input(updateJobSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId
      const role = session.user.role as EmployeeRole

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const existingJob = await prisma.job.findFirst({
        where: { id: input.id, organizationId },
      })

      if (!existingJob) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job requisition not found.",
        })
      }

      const isOwnerOrAdmin =
        role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN

      let finalStatus: JobStatus = input.status
      if (input.status === JobStatus.ACTIVE && existingJob.status !== JobStatus.ACTIVE) {
        if (!isOwnerOrAdmin) {
          finalStatus = JobStatus.PENDING_APPROVAL
        }
      }

      const publishedAt =
        finalStatus === JobStatus.ACTIVE ? existingJob.publishedAt || new Date() : null

      return await prisma.$transaction(async (tx) => {
        // 1. Update basic fields
        const updatedJob = await tx.job.update({
          where: { id: input.id },
          data: {
            businessUnitId: input.businessUnitId || null,
            branchId: input.branchId || null,
            departmentId: input.departmentId || null,
            title: input.title,
            description: input.description,
            employmentType: input.employmentType,
            experienceLevel: input.experienceLevel,
            remoteType: input.remoteType,
            salaryMin: input.salaryMin,
            salaryMax: input.salaryMax,
            currency: input.currency,
            location: input.location,
            isInternalOnly: input.isInternalOnly,
            status: finalStatus,
            publishedAt,
          },
        })

        // 2. Replace skills
        await tx.jobSkill.deleteMany({ where: { jobId: input.id } })
        if (input.skills && input.skills.length > 0) {
          for (const skillName of input.skills) {
            const trimmed = skillName.trim()
            if (!trimmed) continue

            const skill = await tx.skill.upsert({
              where: { name: trimmed },
              create: { name: trimmed },
              update: {},
            })

            await tx.jobSkill.create({
              data: {
                jobId: input.id,
                skillId: skill.id,
              },
            })
          }
        }

        // 3. Replace rounds
        await tx.jobRound.deleteMany({ where: { jobId: input.id } })
        if (input.rounds && input.rounds.length > 0) {
          for (let index = 0; index < input.rounds.length; index++) {
            const roundInput = input.rounds[index]
            const round = await tx.jobRound.create({
              data: {
                jobId: input.id,
                orderIndex: index,
                title: roundInput.title,
                category: roundInput.category,
                durationMinutes: roundInput.durationMinutes,
              },
            })

            if (roundInput.interviewerIds && roundInput.interviewerIds.length > 0) {
              for (const empId of roundInput.interviewerIds) {
                await tx.jobRoundInterviewer.create({
                  data: {
                    roundId: round.id,
                    employeeId: empId,
                  },
                })
              }
            }
          }
        }

        return updatedJob
      })
    }),

  /**
   * Clone a job requisition into a draft copy
   */
  clone: protectedProcedure
    .input(cloneJobSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const target = await prisma.job.findFirst({
        where: { id: input.jobId, organizationId },
        include: {
          skills: { include: { skill: true } },
          rounds: { include: { interviewers: true } },
        },
      })

      if (!target) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job to clone not found.",
        })
      }

      const newTitle = input.newTitle || `Copy of ${target.title}`

      return await prisma.$transaction(async (tx) => {
        const clonedJob = await tx.job.create({
          data: {
            organizationId,
            businessUnitId: target.businessUnitId,
            branchId: target.branchId,
            departmentId: target.departmentId,
            title: newTitle,
            description: target.description,
            employmentType: target.employmentType,
            experienceLevel: target.experienceLevel,
            remoteType: target.remoteType,
            salaryMin: target.salaryMin,
            salaryMax: target.salaryMax,
            currency: target.currency,
            location: target.location,
            isInternalOnly: target.isInternalOnly,
            status: JobStatus.DRAFT,
          },
        })

        // Copy skills
        for (const js of target.skills) {
          await tx.jobSkill.create({
            data: {
              jobId: clonedJob.id,
              skillId: js.skillId,
            },
          })
        }

        // Copy rounds
        for (const r of target.rounds) {
          const newRound = await tx.jobRound.create({
            data: {
              jobId: clonedJob.id,
              orderIndex: r.orderIndex,
              title: r.title,
              category: r.category,
              durationMinutes: r.durationMinutes,
            },
          })

          for (const interviewer of r.interviewers) {
            await tx.jobRoundInterviewer.create({
              data: {
                roundId: newRound.id,
                employeeId: interviewer.employeeId,
              },
            })
          }
        }

        return clonedJob
      })
    }),

  /**
   * Close a job requisition
   */
  close: protectedProcedure
    .input(closeJobSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const job = await prisma.job.findFirst({
        where: { id: input.jobId, organizationId },
      })

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job requisition not found.",
        })
      }

      return await prisma.job.update({
        where: { id: input.jobId },
        data: {
          status: JobStatus.COMPLETED,
          closingDate: new Date(),
        },
      })
    }),

  /**
   * Get organization active employees for round interviewer selector
   */
  getOrgEmployees: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx
    const organizationId = session.user.organizationId

    if (!organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization ID missing from session.",
      })
    }

    const employees = await prisma.employee.findMany({
      where: {
        organizationId,
        status: "Active",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        department: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return employees
  }),

  /**
   * Get organization structure (Business Units, Branches, Departments)
   */
  getOrgStructure: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx
    const organizationId = session.user.organizationId

    if (!organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization ID missing from session.",
      })
    }

    const [businessUnits, branches, departments] = await Promise.all([
      prisma.businessUnit.findMany({
        where: { organizationId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.branch.findMany({
        where: { organizationId, isActive: true },
        select: { id: true, name: true, businessUnitId: true, city: true, country: true },
        orderBy: { name: "asc" },
      }),
      prisma.department.findMany({
        where: { organizationId, isActive: true },
        select: { id: true, name: true, branchId: true },
        orderBy: { name: "asc" },
      }),
    ])

    return {
      businessUnits,
      branches,
      departments,
    }
  }),
})
