import { router, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { ApplicantStatus, EmployeeRole } from "@/types/enums"
import {
  updateApplicantStatusSchema,
  getCandidatesFilterSchema,
} from "@/features/(organization)/candidates/schemas/candidates-schemas"

export const candidatesRouter = router({
  /**
   * Get paginated candidate directory with role & branch scoping
   */
  list: protectedProcedure
    .input(getCandidatesFilterSchema)
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId
      const role = session.user.role as EmployeeRole

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const isOwnerOrGlobalAdmin =
        role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN
      const isBranchAdmin = role === EmployeeRole.BRANCH_ADMIN

      // Role-scoped filter
      const where: any = {
        job: { organizationId },
      }

      if (input.branchId) {
        where.job.branchId = input.branchId
      } else if (isBranchAdmin && session.user.branchId) {
        where.job.branchId = session.user.branchId
      }

      if (input.departmentId) {
        where.job.departmentId = input.departmentId
      }

      if (input.status) {
        where.status = input.status
      }

      if (input.search && input.search.trim().length > 0) {
        const query = input.search.trim()
        where.OR = [
          { candidate: { user: { name: { contains: query, mode: "insensitive" } } } },
          { candidate: { user: { email: { contains: query, mode: "insensitive" } } } },
          { candidate: { user: { phone: { contains: query, mode: "insensitive" } } } },
          { candidate: { user: { location: { contains: query, mode: "insensitive" } } } },
          { candidate: { currentDesignation: { contains: query, mode: "insensitive" } } },
          { job: { title: { contains: query, mode: "insensitive" } } },
        ]
      }

      const [applications, totalCount, statusCounts] = await Promise.all([
        prisma.application.findMany({
          where,
          include: {
            job: {
              select: {
                id: true,
                title: true,
                branchId: true,
                department: { select: { id: true, name: true } },
              },
            },
            candidate: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    location: true,
                    resumeUrl: true,
                  },
                },
              },
            },
            currentRound: {
              select: {
                id: true,
                title: true,
                category: true,
                orderIndex: true,
              },
            },
            screeningResult: {
              select: {
                overallScore: true,
                resumeScore: true,
                voiceScore: true,
                codingScore: true,
                recommendation: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip: (input.page - 1) * input.limit,
          take: input.limit,
        }),
        prisma.application.count({ where }),
        prisma.application.groupBy({
          by: ["status"],
          where: { job: { organizationId } },
          _count: { status: true },
        }),
      ])

      const metrics = {
        total: totalCount,
        applied: statusCounts.find((s) => s.status === ApplicantStatus.APPLIED)?._count.status || 0,
        screening:
          statusCounts.find((s) => s.status === ApplicantStatus.SCREENING)?._count.status || 0,
        interviewing:
          statusCounts.find((s) => s.status === ApplicantStatus.INTERVIEWING)?._count.status || 0,
        offer: statusCounts.find((s) => s.status === ApplicantStatus.OFFER)?._count.status || 0,
        hired: statusCounts.find((s) => s.status === ApplicantStatus.HIRED)?._count.status || 0,
        rejected:
          statusCounts.find((s) => s.status === ApplicantStatus.REJECTED)?._count.status || 0,
      }

      return {
        applications,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / input.limit),
          currentPage: input.page,
        },
        metrics,
      }
    }),

  /**
   * Get candidate analytics metrics for charts
   */
  getAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx
    const organizationId = session.user.organizationId

    if (!organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization ID missing from session.",
      })
    }

    const currentYear = new Date().getFullYear()

    // Applications in current year for growth trend
    const yearApplications = await prisma.application.findMany({
      where: {
        job: { organizationId },
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        screeningScore: true,
      },
    })

    // Group applications by month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    const monthlyGrowth = months.map((monthName, monthIndex) => {
      const monthApps = yearApplications.filter(
        (app) => new Date(app.createdAt).getMonth() === monthIndex
      )

      return {
        month: monthName,
        total: monthApps.length,
        hired: monthApps.filter((a) => a.status === ApplicantStatus.HIRED).length,
        interviewing: monthApps.filter((a) => a.status === ApplicantStatus.INTERVIEWING).length,
      }
    })

    // Screening Score Distribution
    const screeningResults = await prisma.screeningResult.findMany({
      where: {
        application: { job: { organizationId } },
      },
      select: { overallScore: true },
    })

    const scoreRanges = {
      high: screeningResults.filter((s) => (s.overallScore ?? 0) >= 85).length,
      medium: screeningResults.filter((s) => (s.overallScore ?? 0) >= 65 && (s.overallScore ?? 0) < 85).length,
      passing: screeningResults.filter((s) => (s.overallScore ?? 0) >= 50 && (s.overallScore ?? 0) < 65).length,
      low: screeningResults.filter((s) => (s.overallScore ?? 0) < 50).length,
    }

    return {
      monthlyGrowth,
      scoreRanges,
      totalScreened: screeningResults.length,
    }
  }),

  /**
   * Get top merit candidates (AI score >= 50%)
   */
  getTopMeritCandidates: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx
    const organizationId = session.user.organizationId

    if (!organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization ID missing from session.",
      })
    }

    const topApplications = await prisma.application.findMany({
      where: {
        job: { organizationId },
        screeningResult: {
          overallScore: { gte: 80 },
        },
      },
      include: {
        job: {
          select: {
            title: true,
            department: { select: { name: true } },
          },
        },
        candidate: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phone: true,
                location: true,
              },
            },
            skills: { include: { skill: true } },
          },
        },
        screeningResult: true,
      },
      orderBy: {
        screeningResult: {
          overallScore: "desc",
        },
      },
      take: 6,
    })

    return topApplications
  }),



  /**
   * Update candidate applicant status / Kanban column transition
   */
  updateApplicantStatus: protectedProcedure
    .input(updateApplicantStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const existingApp = await prisma.application.findFirst({
        where: {
          id: input.applicationId,
          job: { organizationId },
        },
      })

      if (!existingApp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found in organization.",
        })
      }

      const dataToUpdate: any = {
        status: input.status,
      }

      if (input.currentRoundId !== undefined) {
        dataToUpdate.currentRoundId = input.currentRoundId
      }

      if (input.rejectionReason !== undefined) {
        dataToUpdate.rejectionReason = input.rejectionReason
      }

      if (input.rejectionNotes !== undefined) {
        dataToUpdate.rejectionNotes = input.rejectionNotes
      }

      const updated = await prisma.application.update({
        where: { id: input.applicationId },
        data: dataToUpdate,
      })

      return updated
    }),

  /**
   * Get complete candidate profile & AI screening breakdown for detail drawer
   */
  getCandidateDetail: protectedProcedure
    .input(z.object({ applicationId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx
      const organizationId = session.user.organizationId

      if (!organizationId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Organization ID missing from session.",
        })
      }

      const application = await prisma.application.findFirst({
        where: {
          id: input.applicationId,
          job: { organizationId },
        },
        include: {
          job: {
            include: {
              department: true,
              rounds: { orderBy: { orderIndex: "asc" } },
            },
          },
          candidate: {
            include: {
              user: true,
              skills: { include: { skill: true } },
            },
          },
          currentRound: true,
          screeningResult: true,
          interviews: {
            include: {
              jobRound: true,
              interviewers: { include: { user: true } },
              scorecards: {
                include: {
                  interviewer: { include: { user: true } },
                },
              },
            },
            orderBy: { startTime: "desc" },
          },
        },
      })

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Candidate application not found.",
        })
      }

      return application
    }),

  /**
   * Get active & draft jobs dropdown list for Kanban header filter
   */
  getOrgJobsDropdown: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx
    const organizationId = session.user.organizationId

    if (!organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Organization ID missing from session.",
      })
    }

    const jobs = await prisma.job.findMany({
      where: { organizationId },
      select: {
        id: true,
        title: true,
        status: true,
        department: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return jobs
  }),
})
