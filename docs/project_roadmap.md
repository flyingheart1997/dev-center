# Dev-Center: Detailed Development Roadmap & Phases

This roadmap outlines the implementation schedule, architectural steps, database setups, and verification processes for each phase of the `dev-center` interview platform.

---

## Phase 1: Core Portal, Multi-Tenant Auth & ATS
**Goal**: Build the multi-tenant base, credentials/OAuth onboarding, role-based controls, employee invite dashboard, and custom job pipelines.

### 1. Database Setup & Prisma Schema (Normalized 3NF Architecture)
* Define standard models in `prisma/schema.prisma`:
  * `User`: Master Single Source of Truth for Identity & Contact info (`id`, `name`, `email`, `emailVerified`, `image`, `phone`, `location`, `linkedinUrl`, `githubUrl`, `portfolioUrl`, `resumeUrl`). Links to NextAuth accounts & sessions.
  * `Organization`: Custom domain, websiteUrl, linkedinUrl, logoUrl, industry, data retention policies, and linked `Subscription`.
  * `BusinessUnit`: Business division or segment under the organization (e.g., TCS Digital, TCS BPS).
  * `Branch`: Physical office locations mapped under a business unit with localized parameters (code, timezone, country, city, address, head office flag).
  * `Department`: Functional department inside a branch (e.g., Engineering, HR, Legal).
  * `Employee`: Links user to an organization with optional hierarchical scopes (`businessUnitId`, `branchId`, `departmentId`), role (`Owner`, `Global_Admin`, `Business_Unit_Admin`, `Branch_Admin`, `Recruiter`, `Interviewer`, `Hiring_Manager`), and status (`Active`, `Pending_Approval`).
  * `Candidate`: Domain-specific candidate assessment record linked 1-to-1 via `userId` (`experienceYears`, `currentCompany`, `currentDesignation`, `countryPermit`, `criminalRecord`, `isExistingEmployee`, `consentGiven`, `consentTimestamp`, `tags`). Contact information delegates directly to `User`.
  * `Job`: Title, description, state (`Draft`, `Pending_Approval`, `Active`, `Completed`), scoping mappings (`businessUnitId`, `branchId`, `departmentId`), internal mobility flags (`isInternalOnly`), and candidate parameters. Links to `Application[]` and `JobApproval[]`.
  * `Application`: Connects `Candidate` to a `Job`, tracking state, resume URLs, screening scores, referral links (`referrerId`), structured rejection reasons, and references a candidate's `Offer`.
  * `Skill`: Global library of technical/non-technical competencies.
  * `JobSkill` / `CandidateSkill`: Junction tables mapping jobs and candidates to their required or possessed skills.
  * `JobRound`: Defines interview sequence, order, category (`Screening`, `Technical`, `Design`, `Behavioral`, `Management`), duration, and references assigned interviewers via `JobRoundInterviewer` junction model.
  * `Interview`: Stores scheduled sessions between an `Application` and assigned interview panels, including status (`Scheduled`, `Reschedule_Requested`, etc.), timestamps, meeting links, and references to evaluations.
  * `RescheduleRequest`: Tracks reschedule petitions from candidates or interviewers with proposed alternative time slots and approval states.
  * `AvailabilitySlot`: Captures interviewer and candidate free time windows to prevent double-booking.
  * `TalentPool` / `TalentPoolCandidate`: Enables building candidate CRM talent communities and tagging top applicants for future roles.
  * `Scorecard`: Individual interviewer scorecard ratings (technical, communication, problem solving, culture, overall, recommendation) and feedback filled by a specific employee per interview.
  * `JobApproval`: Tracks internal organizational approval logs for releasing a job requisition.
  * `Offer`: Stores salary package, start dates, and status for job offers sent to candidates.
  * `OfferApproval`: Tracks internal workflows for approving candidate job offer releases.
  * `CandidatePlan`: Dedicated B2C candidate subscription tiers (Free, Prep Pro, Prep Unlimited) with quotas for mock interviews, practice coding tests, and ATS resume reviews.
  * `CandidateSubscription`: B2C Stripe subscription linkage for candidate self-preparation.
  * `PracticeSession`: Records candidate AI mock verbal and technical interview practice sessions with Gemini feedback scores and transcripts.
  * `ResumeReview`: Stores candidate AI ATS resume match scores, keyword optimization analysis, and formatting recommendations.
  * `SavedJob`: Candidate job bookmarks allowing job seekers to save postings for later review.
  * `JobBoardConnection`: Stores organization or branch-scoped credentials (OAuth tokens / API keys) for connected job boards (LinkedIn, Indeed, Naukri, Monster, Wellfound, Greenhouse, Lever).
  * `JobBoardPost`: Tracks which jobs are posted on which connected boards, including status (`Pending`, `Posted`, `Failed`), external job IDs, redirect URL, and API error logs.
  * `Plan`: Dedicated database-driven tiers (Free, Pro, Enterprise) detailing pricing and structural limits (`activeJobsLimit`, `aiCreditsLimit`, `maxBusinessUnits`, `maxBranches`, `maxEmployees`).
  * `Subscription`: Stores Stripe customer identifiers and references the active `Plan`.
  * `Question`: Dynamic library of challenges containing isSystem flags, tags, language constraints, execution limits, difficulty levels, and unique organization-scoped names.
  * `Notification`: Stores unread/read in-app alerts with deep-linking support.
  * `EmployeeInvitation`: Tracks pending recruiter-sent email onboardings with expiration limits and initial scope assignments (`businessUnitId`, `branchId`, `departmentId`).
  * `AuditLog`: Enterprise compliance audit trails tracking administrative actions, role updates, session revocations, password changes (`AuditEvent`), payload diff snapshots, and IP origins.
  * NextAuth standard tables: `User` (`tokenVersion`, `lastPasswordChangedAt`), `Account`, `Session` (`userAgent`, `ipAddress`, `revokedAt`), `VerificationToken` linked via Prisma adapter. `User` links to both `Employee` and `Candidate` profiles.

### 2. Custom NextAuth.js Configuration & Production Auth Architecture
* Setup `auth.ts` under `lib/auth.ts` (Auth.js v5) & `proxy.ts`:
  * **Progressive 2-Step Registration (`/register`)**: Step 0 Intent Choice -> Step 1 Email check (`checkEmailExists`) & Social Auth -> Step 2 Credentials.
  * **Email Verification Gate**: Unverified users (`emailVerified === null`) strictly routed to `/verify-email`. Social users are auto-verified.
  * **Instant Token Invalidation (`tokenVersion`)**: Any password change, user deletion, status update, or security reset increments `tokenVersion`, invalidating active tokens globally.
  * **Scalable `AuthCache` Layer (`lib/utils/auth-cache.ts`)**: 30-second TTL LRU memory cache (`AUTH_CACHE_TTL`) protecting DB connections from request bursts.
  * **Soft Session Revocation & Active Device Management**: `Session` table soft-revokes tokens (`revokedAt = new Date()`) for remote device logouts without destroying audit logs.
  * **Global 401 Client Interceptor**: Automatically triggers `signOut({ callbackUrl: "/login?error=SessionExpired" })` on 401 response without requiring manual refresh.
  * **Atomic Organization Setup (`/setup-org`)**: Org Founders configure their workspace. A single Prisma `$transaction` creates Organization, BusinessUnit, Branch, Department, and Employee records atomically.
  * **Tokenized Employee Invites**: Employees join strictly via signed invitation tokens (`/register?inviteToken=xyz`).
  * **Role-based Security & Cross-Workspace Protection**: Enforce scope-based endpoint protection (tRPC middleware). Strict proxy routing prevents Candidates from accessing employer `/dashboard`, and vice versa.
* **Route Groups & Dual Left Sidebar Layout Architecture**:
  * **`(organization)` (B2B Employer & Admin Portal)**: Left Sidebar layout with Organization/Branch Switcher dropdown, and sections for *Overview*, *Hiring Pipeline* (Jobs, Candidates, Interviews), *Governance & CRM* (Approvals Queue, Talent Pools, Referrals), *Question Library*, and *Admin Settings* (Org Hierarchy, Audit Logs, Billing).
  * **`(candidate)` (B2C Candidate Portal & AI Prep Studio)**: Left Sidebar layout with Candidate Avatar, Profile Completion Bar, Prep Pro Badge, and sections for *My Career* (Hub, Applications, Saved Jobs), *AI Prep Studio* (Voice Mock, ATS Resume Review, Coding Arena), and *Billing/Settings*.
  * **`(room)` (Fullscreen Collaborative Arena)**: Distraction-free layout for live WebRTC video + shared code editor interviews.
  * **`(auth)` & `(legal)`**: Clean card layouts for login/onboarding choices, legal suite (`/privacy`, `/terms`), and public job search boards.

---

## Phase 2: Candidate AI Prep Studio & AI Workspace (Completed)
**Goal**: Build the B2C Candidate Prep Arena, ATS Resume Review, and AI Virtual Compilers.

### 1. AI Voice Mock Arena (`/candidate/voice-arena`)
* Audio question generation, microphone wave visualizer, Gemini speech analysis, and technical/clarity score reporting.

### 2. ATS Resume Studio (`/candidate/resume-studio`)
* Drag-and-drop resume PDF parser, Gemini ATS score evaluation (0-100), skills extraction, and job description match optimizer.

### 3. AI Coding Practice Arena (`/candidate/coding-practice`)
* Monaco Editor code environment (Python, JS, Java, Go, C++), Gemini virtual compiler test case execution, and $O(N)$ complexity rating.

---

## Phase 3: Enterprise Organization Dashboard, Job Management & ATS Pipeline (In Progress)
**Goal**: Build the multi-tenant enterprise dashboard, job requisition workflows, round configurations, candidate ATS Kanban pipelines, and approval queues.

### 1. Multi-Role Enterprise Organization Dashboard (`/dashboard`) (Completed)
* **Role-Based Dynamic Visualization**:
  * Scoped data fetching via tRPC (`getOrganizationDashboard`): Multi-tenant isolation by `organizationId` (Owner/Admin) or `branchId` (Branch Admin/Recruiter) or `employeeId` (Interviewer).
  * **Top KPI Summary Cards (`KpiSummaryCards`)**: 4 theme-colored metrics (`Active Job Requisitions`, `Pipeline Candidates`, `Scheduled Live Interviews`, `Pending Approvals`) with trend growth badges (`+12%`), secondary subtitles, 5-bar mini sparkline visualizers, and radial background glows.
  * **Left Operational Column (`lg:col-span-2`)**:
    * `ActiveJobsWidget`: Top 5 active published requisitions with applicant count badges and direct links.
    * `AiScreeningAnalyticsWidget`: Real-time AI Voice & Compiler Arena performance charts (Recharts AreaChart, pass/fail trends, 4 mini AI metric cards).
    * `DraftJobsWidget`: Incomplete draft requisitions with quick `Resume Setup` actions.
    * `RecentCandidatesWidget`: Latest candidate evaluations with status badges and interview scores.
  * **Right Action Sidebar Column (`lg:col-span-1`)**:
    * `RoleActionButtons`: Role-aware quick actions (`Create Job`, `Invite Team`).
    * `UpcomingInterviewsWidget`: Scheduled live interviews with dual-mode views (Option A 1-row for Interviewer, Option B 2-row for Admin/HR with Interviewer Avatar & Designation).
    * `PendingScorecardsWidget`: Pending feedback forms with dual-mode views and `[Fill Scorecard]` CTA.
    * `PendingOffersWidget`: Active candidate job offer letters with salary packages.
    * `PendingRequisitionsWidget`: Job requisitions awaiting administrative verification and approval sign-off.
* **Component Architecture & Refactoring**:
  * Unified `InterviewCardItem` micro-component eliminating TSX code duplication.
  * Strict `cn(...)` utility enforcement for all conditional Tailwind styling.
  * Cyan-to-blue text gradient matching `public/logo.png` on sidebar logo text (`Dev Center`).

### 2. Job Requisition Management (`/jobs` & `/jobs/create-job`) (Next Up)
* Job Requisition Multi-Step Creator Wizard (`/jobs/create-job`): Scoping, Required Skills tagger, Round Setup configurator, and Approval trigger.
* Enterprise Job Listing & Management (`/jobs`): Status filter tabs (`Active`, `Draft`, `Pending Approval`, `Completed`) and quick actions.

### 3. Candidate ATS Kanban Pipeline (`/candidates` & `/jobs/[jobId]/candidates`) (Pending)
* Drag-and-Drop Kanban Board (`Applied` ➔ `AI Pre-Screened` ➔ `Round 1 Technical` ➔ `Round 2 Interview` ➔ `Offer Extended` ➔ `Hired / Rejected`).
* Candidate details drawer with ATS resume preview, AI evaluation scores, and scorecard summaries.

---

## Phase 4: AI Pre-Screening & Virtual Compiler (Pending)
**Goal**: Gemini API Virtual Compiler, Case-by-case evaluation, Auto-shortlisting, and candidate ranking.

---

## Phase 5: Live WebRTC Interview Rooms (Pending)
**Goal**: Live WebRTC video/audio calls, Shared collaborative code editor, Live notes & scorecard submission.
