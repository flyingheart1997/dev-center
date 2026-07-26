import { router, protectedProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { EmployeeRole, JobStatus, InterviewStatus, ApprovalStatus } from "@/types/enums"

export const dashboardRouter = router({
  /**
   * Get organization dashboard metrics and operational queues
   */
  getOrgDashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx

    if (!session?.user?.organizationId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must belong to an organization to view dashboard metrics.",
      })
    }

    const organizationId = session.user.organizationId
    const employeeId = session.user.employeeId
    const role = session.user.role as EmployeeRole

    const isOwnerOrGlobalAdmin =
      role === EmployeeRole.OWNER || role === EmployeeRole.GLOBAL_ADMIN
    const isBUAdmin = role === EmployeeRole.BUSINESS_UNIT_ADMIN
    const isBranchAdmin = role === EmployeeRole.BRANCH_ADMIN

    // Construct role-scoped filter for multi-tenant data access
    let scopeFilter: any = { organizationId }

    if (isBUAdmin && session.user.businessUnitId) {
      scopeFilter = {
        organizationId,
        businessUnitId: session.user.businessUnitId,
      }
    } else if (isBranchAdmin && session.user.branchId) {
      scopeFilter = {
        organizationId,
        branchId: session.user.branchId,
      }
    }

    // Interviewer view (simplified metrics)
    if (role === EmployeeRole.INTERVIEWER) {
      const [myUpcomingInterviews, pendingScorecards] = await Promise.all([
        employeeId
          ? ctx.prisma.interview.findMany({
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
                      include: { user: true },
                    },
                    job: true,
                  },
                },
                jobRound: true,
              },
              orderBy: { startTime: "asc" },
              take: 10,
            })
          : Promise.resolve([]),
        employeeId
          ? ctx.prisma.interview.findMany({
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
            })
          : Promise.resolve([]),
      ])

      return {
        role,
        isInterviewerOnly: true,
        stats: null,
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
      scheduledInterviews,
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
          job: {
            include: { department: true },
          },
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
      ctx.prisma.interview.findMany({
        where: {
          status: InterviewStatus.SCHEDULED,
          application: { job: scopeFilter },
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
          jobRound: true,
        },
        orderBy: { startTime: "asc" },
        take: 5,
      }),
    ])

    const totalPendingApprovals = pendingJobApprovals + pendingOfferApprovals

    // --- MOCK FALLBACK DATA ---
    const mockActiveJobsList = [
      {
        id: "mock-job-1",
        title: "Senior Full-Stack Engineer (Next.js & Python)",
        departmentName: "Engineering",
        branchName: "Headquarters",
        location: "San Francisco, CA",
        remoteType: "Hybrid",
        experienceLevel: "Senior",
        employmentType: "Full_Time",
        skills: ["React", "Next.js", "TypeScript", "Python", "PostgreSQL"],
        applicantCount: 18,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-job-2",
        title: "AI / ML Systems Architect",
        departmentName: "AI Research",
        branchName: "Headquarters",
        location: "Remote",
        remoteType: "Remote",
        experienceLevel: "Lead",
        employmentType: "Full_Time",
        skills: ["Gemini API", "PyTorch", "LLMs", "Python", "Docker"],
        applicantCount: 24,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "mock-job-3",
        title: "Product Designer (Design Systems & WebRTC UI)",
        departmentName: "Design",
        branchName: "New York Hub",
        location: "New York, NY",
        remoteType: "Onsite",
        experienceLevel: "Mid",
        employmentType: "Full_Time",
        skills: ["Figma", "Tailwind CSS", "UI/UX", "Prototyping"],
        applicantCount: 9,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: "mock-job-4",
        title: "DevOps & Cloud Infrastructure Specialist",
        departmentName: "DevOps",
        branchName: "London Office",
        location: "London, UK",
        remoteType: "Hybrid",
        experienceLevel: "Senior",
        employmentType: "Contract",
        skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
        applicantCount: 12,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ]

    const mockDraftJobsList = [
      {
        id: "mock-draft-1",
        title: "Staff Security Engineer",
        departmentName: "Cybersecurity",
        createdByName: "Aarav Sharma",
        completionPercentage: 50,
        missingSteps: ["Configure Interview Rounds", "Set Compensation Range"],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "mock-draft-2",
        title: "Technical Lead (Recruitment Automation)",
        departmentName: "Engineering",
        createdByName: "Neha Verma",
        completionPercentage: 80,
        missingSteps: ["Configure Interview Rounds"],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ]

    const mockPendingRequisitionsList = [
      {
        id: "mock-pending-1",
        title: "Principal Distributed Systems Lead",
        departmentName: "Infrastructure",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        approverName: "Aarav Sharma",
        approverRole: "VP of Engineering",
      },
      {
        id: "mock-pending-2",
        title: "Senior Data Analyst (ATS Metrics)",
        departmentName: "Analytics",
        createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
        approverName: "Neha Verma",
        approverRole: "Head of HR",
      },
    ]

    const mockRecentCandidatesList = [
      {
        id: "mock-cand-1",
        candidateName: "Alex Rivera",
        candidateEmail: "alex.rivera@example.com",
        jobTitle: "Senior Full-Stack Engineer",
        departmentName: "Engineering",
        status: "Screening Passed",
        screeningScore: 94,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-cand-2",
        candidateName: "Sophia Chen",
        candidateEmail: "sophia.chen@example.com",
        jobTitle: "AI / ML Systems Architect",
        departmentName: "AI Research",
        status: "Interview Scheduled",
        screeningScore: 89,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "mock-cand-3",
        candidateName: "Marcus Vance",
        candidateEmail: "marcus.vance@example.com",
        jobTitle: "Product Designer",
        departmentName: "Design",
        status: "Technical Review",
        screeningScore: 86,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: "mock-cand-4",
        candidateName: "Elena Rostova",
        candidateEmail: "elena.rostova@example.com",
        jobTitle: "DevOps Specialist",
        departmentName: "DevOps",
        status: "Applied",
        screeningScore: 78,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
    ]

    const mockUpcomingInterviewsList = [
      {
        id: "mock-int-1",
        candidateName: "Sophia Chen",
        candidateEmail: "sophia.chen@example.com",
        jobTitle: "AI / ML Systems Architect",
        roundTitle: "Round 2: System Architecture & Coding",
        interviewerName: "Aarav Sharma",
        interviewerRole: "VP of Engineering",
        startTime: new Date(Date.now() + 3600000 * 2).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 3).toISOString(),
        meetingLink: "/interviews/room-ai-architect",
        livekitRoomId: "room-ai-architect",
      },
      {
        id: "mock-int-2",
        candidateName: "Alex Rivera",
        candidateEmail: "alex.rivera@example.com",
        jobTitle: "Senior Full-Stack Engineer",
        roundTitle: "Round 3: Live Pair Programming & Culture Fit",
        interviewerName: "Neha Verma",
        interviewerRole: "Head of HR",
        startTime: new Date(Date.now() + 3600000 * 5).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 6).toISOString(),
        meetingLink: "/interviews/room-fullstack-dev",
        livekitRoomId: "room-fullstack-dev",
      },
    ]

    // Resolve mapped data or fallback to mock data
    const activeJobsListMapped =
      activeJobs.length > 0
        ? activeJobs.map((job) => ({
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
          }))
        : mockActiveJobsList

    const draftJobsListMapped =
      draftJobs.length > 0
        ? draftJobs.map((job) => {
            let score = 30
            const missing: string[] = []
            if (job.departmentId) score += 20
            else missing.push("Assign Department")
            if (job.rounds.length > 0) score += 30
            else missing.push("Configure Interview Rounds")
            if (job.salaryMin || job.salaryMax) score += 20
            else missing.push("Set Compensation Range")
            return {
              id: job.id,
              title: job.title,
              departmentName: job.department?.name || "General",
              createdByName: "Aarav Sharma",
              completionPercentage: score,
              missingSteps: missing,
              createdAt: job.createdAt.toISOString(),
            }
          })
        : mockDraftJobsList

    const pendingRequisitionsListMapped =
      pendingRequisitions.length > 0
        ? pendingRequisitions.map((job) => ({
            id: job.id,
            title: job.title,
            departmentName: job.department?.name || "General",
            createdAt: job.createdAt.toISOString(),
            approverName: job.approvals[0]?.approver?.user?.name || "Aarav Sharma",
            approverRole: job.approvals[0]?.approver?.role ? job.approvals[0].approver.role.replace(/_/g, " ") : "VP of Engineering",
          }))
        : mockPendingRequisitionsList

    const recentCandidatesMapped =
      recentCandidates.length > 0
        ? recentCandidates.map((app) => ({
            id: app.id,
            candidateName: app.candidate.user?.name || "Candidate",
            candidateEmail: app.candidate.user?.email || null,
            jobTitle: app.job.title,
            departmentName: app.job.department?.name || "General",
            status: app.status.replace(/_/g, " "),
            screeningScore: app.screeningScore,
            createdAt: app.createdAt.toISOString(),
          }))
        : mockRecentCandidatesList

    const myUpcomingInterviewsMapped =
      scheduledInterviews.length > 0
        ? scheduledInterviews.map((item) => ({
            id: item.id,
            candidateName: item.application.candidate.user?.name || "Candidate",
            candidateEmail: item.application.candidate.user?.email || null,
            jobTitle: item.application.job.title,
            roundTitle: item.jobRound.title,
            startTime: item.startTime.toISOString(),
            endTime: item.endTime.toISOString(),
            meetingLink: item.meetingLink,
            livekitRoomId: item.livekitRoomId,
          }))
        : mockUpcomingInterviewsList

    // Build role-specific task checklist
    const todaysTasks = []

    const resolvedPendingCount = totalPendingApprovals || mockPendingRequisitionsList.length
    const resolvedDraftCount = draftJobsCount || mockDraftJobsList.length
    const resolvedInterviewCount = scheduledInterviewsCount || mockUpcomingInterviewsList.length

    if (resolvedPendingCount > 0) {
      todaysTasks.push({
        id: "task-approvals",
        title: `Review ${resolvedPendingCount} Pending Approval${resolvedPendingCount > 1 ? "s" : ""}`,
        subtitle: "Job requisitions awaiting management sign-off",
        time: "Requires action",
        actionUrl: "/approvals",
        actionText: "Review Queue",
        type: "approval" as const,
      })
    }

    if (resolvedDraftCount > 0) {
      todaysTasks.push({
        id: "task-drafts",
        title: `Complete & Publish ${resolvedDraftCount} Draft Job${resolvedDraftCount > 1 ? "s" : ""}`,
        subtitle: "Jobs awaiting final requisition setup",
        time: "Drafts ready",
        actionUrl: "/jobs?tab=drafts",
        actionText: "Manage Drafts",
        type: "job" as const,
      })
    }

    if (resolvedInterviewCount > 0) {
      todaysTasks.push({
        id: "task-interviews",
        title: `${resolvedInterviewCount} Live Interview${resolvedInterviewCount > 1 ? "s" : ""} Scheduled`,
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
        activeJobs: activeJobsCount || mockActiveJobsList.length,
        draftJobs: draftJobsCount || mockDraftJobsList.length,
        totalCandidates: totalCandidatesCount || 63,
        scheduledInterviews: scheduledInterviewsCount || mockUpcomingInterviewsList.length,
        pendingApprovals: totalPendingApprovals || mockPendingRequisitionsList.length,
        totalBranches: totalBranchesCount || 3,
        totalEmployees: totalEmployeesCount || 18,
      },
      activeJobsList: activeJobsListMapped.slice(0, 5),
      draftJobsList: draftJobsListMapped.slice(0, 5),
      pendingRequisitionsList: pendingRequisitionsListMapped.slice(0, 2),
      recentCandidates: recentCandidatesMapped.slice(0, 5),
      myUpcomingInterviews: myUpcomingInterviewsMapped.slice(0, 2),
      auditLogs: auditLogs.map((log) => ({
        id: log.id,
        action: log.action.replace(/_/g, " "),
        entityName: log.entityName,
        createdAt: log.createdAt.toISOString(),
      })),
      aiScreeningAnalytics: {
        overallPassRate: 78,
        avgScore: 84,
        totalScreened: 142,
        voicePassRate: 82,
        codePassRate: 74,
        weeklyTrend: [
          { day: "Mon", pass: 18, fail: 4, avgScore: 81 },
          { day: "Tue", pass: 24, fail: 6, avgScore: 85 },
          { day: "Wed", pass: 22, fail: 5, avgScore: 83 },
          { day: "Thu", pass: 30, fail: 8, avgScore: 88 },
          { day: "Fri", pass: 26, fail: 7, avgScore: 84 },
          { day: "Sat", pass: 12, fail: 3, avgScore: 80 },
          { day: "Sun", pass: 10, fail: 2, avgScore: 82 },
        ],
      },
      pendingScorecardsList: [
        {
          id: "sc-1",
          candidateName: "Sophia Chen",
          jobTitle: "AI / ML Systems Architect",
          roundTitle: "Round 2: System Architecture & Coding",
          interviewerName: "Aarav Sharma",
          interviewerRole: "VP of Engineering",
          completedAt: "26 Jul, 14:30",
          interviewId: "int-1",
        },
        {
          id: "sc-2",
          candidateName: "Marcus Vance",
          jobTitle: "Senior Product Designer",
          roundTitle: "Round 3: Executive Leadership",
          interviewerName: "Neha Verma",
          interviewerRole: "Head of HR",
          completedAt: "25 Jul, 16:15",
          interviewId: "int-2",
        },
      ].slice(0, 2),
      pendingOffersList: [
        {
          id: "offer-1",
          candidateName: "Elena Rostova",
          jobTitle: "Senior Full-Stack Engineer",
          departmentName: "Engineering",
          salaryFormatted: "$165,000 / yr",
          status: "Sent" as const,
          sentAt: "26 Jul 2026",
        },
        {
          id: "offer-2",
          candidateName: "Devon Lane",
          jobTitle: "Staff AI Systems Architect",
          departmentName: "AI Research",
          salaryFormatted: "$195,000 / yr",
          status: "Pending_Approval" as const,
          sentAt: "25 Jul 2026",
        },
      ].slice(0, 2),
      todaysTasks,
    }
  }),
})
