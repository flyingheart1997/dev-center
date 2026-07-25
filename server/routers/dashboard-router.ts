import { TRPCError } from "@trpc/server"
import { router, protectedProcedure } from "../trpc"
import { EmployeeRole, JobStatus, InterviewStatus, ApprovalStatus } from "@/types/enums"

export const dashboardRouter = router({
  getOrgDashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session
    const { organizationId, branchId, employeeId, role } = user

    if (!organizationId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Organization access required.",
      })
    }

    const isOwnerOrGlobalAdmin = role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN
    const isInterviewerOnly = role === EmployeeRole.INTERVIEWER
    const isBranchAdmin = role === EmployeeRole.BRANCH_ADMIN

    // Common query scope
    const scopeFilter = isOwnerOrGlobalAdmin
      ? { organizationId }
      : isBranchAdmin && branchId
      ? { organizationId, branchId }
      : { organizationId }

    // If Interviewer, return dedicated interviewer operational dataset
    if (isInterviewerOnly && employeeId) {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      const [myUpcomingInterviews, pendingScorecards] = await Promise.all([
        ctx.prisma.interview.findMany({
          where: {
            status: InterviewStatus.SCHEDULED,
            jobRound: {
              interviewers: {
                some: { employeeId },
              },
            },
          },
          include: {
            application: {
              include: {
                candidate: {
                  include: {
                    user: true,
                  },
                },
                job: true,
              },
            },
            jobRound: true,
          },
          orderBy: { startTime: "asc" },
          take: 10,
        }),
        ctx.prisma.interview.findMany({
          where: {
            status: InterviewStatus.COMPLETED,
            jobRound: {
              interviewers: {
                some: { employeeId },
              },
            },
            scorecards: {
              none: { interviewerId: employeeId },
            },
          },
          include: {
            application: {
              include: {
                candidate: {
                  include: { user: true },
                },
                job: true,
              },
            },
          },
          orderBy: { startTime: "desc" },
          take: 10,
        }),
      ])

      return {
        role,
        isInterviewerOnly: true,
        stats: null, // High level stats omitted for Interviewer
        myUpcomingInterviews: myUpcomingInterviews.map((item) => ({
          id: item.id,
          candidateName: item.application.candidate.user?.name || "Candidate",
          candidateEmail: item.application.candidate.user?.email || null,
          jobTitle: item.application.job.title,
          roundTitle: item.jobRound.title,
          startTime: item.startTime.toISOString(),
          endTime: item.endTime.toISOString(),
          meetingLink: item.meetingLink,
          livekitRoomId: item.livekitRoomId,
        })),
        pendingScorecards: pendingScorecards.map((item) => ({
          id: item.id,
          candidateName: item.application.candidate.user?.name || "Candidate",
          jobTitle: item.application.job.title,
          completedAt: item.endTime.toISOString(),
        })),
        todaysTasks: [
          ...myUpcomingInterviews.map((item) => ({
            id: `interview-${item.id}`,
            title: `Conduct Interview with ${item.application.candidate.user?.name || "Candidate"}`,
            subtitle: `${item.application.job.title} • ${item.jobRound.title}`,
            time: new Date(item.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            actionUrl: `/interview/${item.id}`,
            actionText: "Join Live Room",
            type: "interview" as const,
          })),
          ...pendingScorecards.map((item) => ({
            id: `scorecard-${item.id}`,
            title: `Submit Scorecard for ${item.application.candidate.user?.name || "Candidate"}`,
            subtitle: item.application.job.title,
            time: "Action required",
            actionUrl: `/interviews?scorecard=${item.id}`,
            actionText: "Fill Feedback",
            type: "scorecard" as const,
          })),
        ],
      }
    }

    // High-Level Stats & Operational Lists for Owner, Admin, Recruiter, Hiring Manager
    const [
      activeJobsCount,
      draftJobsCount,
      totalCandidatesCount,
      scheduledInterviewsCount,
      pendingJobApprovals,
      pendingOfferApprovals,
      totalBranchesCount,
      totalEmployeesCount,
      recentCandidates,
      auditLogs,
      activeJobs,
      draftJobs,
      pendingRequisitions,
    ] = await Promise.all([
      ctx.prisma.job.count({
        where: { ...scopeFilter, status: JobStatus.ACTIVE },
      }),
      ctx.prisma.job.count({
        where: { ...scopeFilter, status: JobStatus.DRAFT },
      }),
      ctx.prisma.application.count({
        where: {
          job: scopeFilter,
        },
      }),
      ctx.prisma.interview.count({
        where: {
          status: InterviewStatus.SCHEDULED,
          application: { job: scopeFilter },
        },
      }),
      ctx.prisma.jobApproval.count({
        where: {
          status: ApprovalStatus.PENDING,
          job: scopeFilter,
        },
      }),
      ctx.prisma.offerApproval.count({
        where: {
          status: ApprovalStatus.PENDING,
          offer: {
            application: { job: scopeFilter },
          },
        },
      }),
      isOwnerOrGlobalAdmin
        ? ctx.prisma.branch.count({ where: { organizationId } })
        : Promise.resolve(1),
      isOwnerOrGlobalAdmin
        ? ctx.prisma.employee.count({ where: { organizationId } })
        : Promise.resolve(0),
      ctx.prisma.application.findMany({
        where: {
          job: scopeFilter,
        },
        include: {
          candidate: {
            include: { user: true },
          },
          job: true,
          screeningResult: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      isOwnerOrGlobalAdmin
        ? ctx.prisma.auditLog.findMany({
            where: { organizationId },
            orderBy: { createdAt: "desc" },
            take: 5,
          })
        : Promise.resolve([]),
      ctx.prisma.job.findMany({
        where: { ...scopeFilter, status: JobStatus.ACTIVE },
        include: {
          department: true,
          branch: true,
          skills: {
            include: { skill: true },
          },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      ctx.prisma.job.findMany({
        where: { ...scopeFilter, status: JobStatus.DRAFT },
        include: {
          department: true,
          rounds: true,
          approvals: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      ctx.prisma.job.findMany({
        where: { ...scopeFilter, status: JobStatus.PENDING_APPROVAL },
        include: {
          department: true,
          approvals: {
            include: {
              approver: {
                include: { user: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

    const totalPendingApprovals = pendingJobApprovals + pendingOfferApprovals

    // Build role-specific task checklist
    const todaysTasks = []

    if (totalPendingApprovals > 0) {
      todaysTasks.push({
        id: "task-approvals",
        title: `Review ${totalPendingApprovals} Pending Approval${totalPendingApprovals > 1 ? "s" : ""}`,
        subtitle: `${pendingJobApprovals} Job Requisitions, ${pendingOfferApprovals} Offers`,
        time: "Requires action",
        actionUrl: "/approvals",
        actionText: "Review Queue",
        type: "approval" as const,
      })
    }

    if (draftJobsCount > 0) {
      todaysTasks.push({
        id: "task-drafts",
        title: `Complete & Publish ${draftJobsCount} Draft Job${draftJobsCount > 1 ? "s" : ""}`,
        subtitle: "Jobs awaiting final requisition setup",
        time: "Drafts ready",
        actionUrl: "/jobs?tab=drafts",
        actionText: "Manage Drafts",
        type: "job" as const,
      })
    }

    if (scheduledInterviewsCount > 0) {
      todaysTasks.push({
        id: "task-interviews",
        title: `${scheduledInterviewsCount} Live Interview${scheduledInterviewsCount > 1 ? "s" : ""} Scheduled`,
        subtitle: "Upcoming candidate live video sessions",
        time: "Scheduled today",
        actionUrl: "/interviews",
        actionText: "View Schedule",
        type: "interview" as const,
      })
    }

    return {
      role,
      isInterviewerOnly: false,
      stats: {
        activeJobs: activeJobsCount,
        draftJobs: draftJobsCount,
        totalCandidates: totalCandidatesCount,
        scheduledInterviews: scheduledInterviewsCount,
        pendingApprovals: totalPendingApprovals,
        totalBranches: totalBranchesCount,
        totalEmployees: totalEmployeesCount,
      },
      activeJobsList: activeJobs.map((job) => ({
        id: job.id,
        title: job.title,
        departmentName: job.department?.name || "General",
        branchName: job.branch?.name || "Headquarters",
        location: job.location || "Remote",
        remoteType: job.remoteType,
        experienceLevel: job.experienceLevel,
        employmentType: job.employmentType,
        skills: job.skills.map((s) => s.skill.name),
        applicantCount: job._count.applications,
        createdAt: job.createdAt.toISOString(),
      })),
      draftJobsList: draftJobs.map((job) => {
        let score = 30
        const missing: string[] = []
        if (job.departmentId) {
          score += 20
        } else {
          missing.push("Assign Department")
        }
        if (job.rounds.length > 0) {
          score += 30
        } else {
          missing.push("Configure Interview Rounds")
        }
        if (job.salaryMin || job.salaryMax) {
          score += 20
        } else {
          missing.push("Set Compensation Range")
        }
        return {
          id: job.id,
          title: job.title,
          departmentName: job.department?.name || "General",
          completionPercentage: score,
          missingSteps: missing,
          createdAt: job.createdAt.toISOString(),
        }
      }),
      pendingRequisitionsList: pendingRequisitions.map((job) => ({
        id: job.id,
        title: job.title,
        departmentName: job.department?.name || "General",
        createdAt: job.createdAt.toISOString(),
        approverName: job.approvals[0]?.approver?.user?.name || "Admin",
      })),
      recentCandidates: recentCandidates.map((app) => ({
        id: app.id,
        candidateName: app.candidate.user?.name || "Candidate",
        candidateEmail: app.candidate.user?.email || null,
        jobTitle: app.job.title,
        status: app.status.replace(/_/g, " "),
        screeningScore: app.screeningScore,
        createdAt: app.createdAt.toISOString(),
      })),
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action.replace(/_/g, " "),
        entityName: log.entityName,
        createdAt: log.createdAt.toISOString(),
      })),
      todaysTasks,
    }
  }),
})
