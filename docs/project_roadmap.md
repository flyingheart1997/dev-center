# Dev-Center: Detailed Development Roadmap & Phases

This roadmap outlines the implementation schedule, architectural steps, database setups, and verification processes for each phase of the `dev-center` interview platform.

---

## Phase 1: Core Portal, Multi-Tenant Auth & ATS
**Goal**: Build the multi-tenant base, credentials/OAuth onboarding, role-based controls, employee invite dashboard, and custom job pipelines.

### 1. Database Setup & Prisma Schema
* Define standard models in `prisma/schema.prisma`:
  * `Organization`: Custom domain, name, data retention policies, and linked `Subscription`.
  * `BusinessUnit`: Business division or segment under the organization (e.g., TCS Digital, TCS BPS).
  * `Branch`: Physical office locations mapped under a business unit with localized parameters (code, timezone, country, city, address, head office flag).
  * `Department`: Functional department inside a branch (e.g., Engineering, HR, Legal).
  * `Employee`: Links user to an organization with optional hierarchical scopes (`businessUnitId`, `branchId`, `departmentId`), role (`Owner`, `Global_Admin`, `Business_Unit_Admin`, `Branch_Admin`, `Recruiter`, `Interviewer`, `Hiring_Manager`), and status (`Active`, `Pending_Approval`).
  * `Job`: Title, description, state (`Draft`, `Pending_Approval`, `Active`, `Completed`), scoping mappings (`businessUnitId`, `branchId`, `departmentId`), internal mobility flags (`isInternalOnly`), and candidate parameters. Links to `Application[]` and `JobApproval[]`.
  * `Candidate`: Master profile of a job seeker containing contact info, work permit status, tags, and GDPR consent tracks.
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
  * `AuditLog`: Enterprise compliance audit trails tracking administrative actions, role updates, application status shifts, payload diff snapshots, and IP origins.
  * NextAuth standard tables: `User`, `Account`, `Session`, `VerificationToken` linked via Prisma adapter. `User` links to both `Employee` and `Candidate` profiles.

### 2. Custom NextAuth.js Configuration & Dual-Portal Route Groups
* Setup `auth.ts` under `features/auth/` (Auth.js v5):
  * Configure Credentials provider, Google OAuth, GitHub OAuth, and LinkedIn OAuth.
  * Setup callbacks to attach `organization_id`, `role`, `employee_status`, and `candidate_id` to the JWT token and session cookies.
  * Block login if an employee is in the `Pending_Approval` queue until approved by an Org Admin.
  * Setup transactional email validation using **Resend** for onboarding.
  * Enforce role and scope-based endpoint protection (tRPC middleware & Next.js Server Actions) verifying that actions are restricted based on employee's Role and corresponding target resource scopes (`GLOBAL`, `BUSINESS_UNIT`, `BRANCH`, `DEPARTMENT`).
* **Route Groups & Dual Left Sidebar Layout Architecture**:
  * **`(dashboard)` (B2B Employer & Admin Portal)**: Left Sidebar layout with Organization/Branch Switcher dropdown, and sections for *Overview*, *Hiring Pipeline* (Jobs, Candidates, Interviews), *Governance & CRM* (Approvals Queue, Talent Pools, Referrals), *Question Library*, and *Admin Settings* (Org Hierarchy, Audit Logs, Billing).
  * **`(candidate)` (B2C Candidate Portal & AI Prep Studio)**: Left Sidebar layout with Candidate Avatar, Profile Completion Bar, Prep Pro Badge, and sections for *My Career* (Hub, Applications, Saved Jobs), *AI Prep Studio* (Voice Mock, ATS Resume Review, Coding Arena), and *Billing/Settings*.
  * **`(room)` (Fullscreen Collaborative Arena)**: Distraction-free layout for live WebRTC video + shared code editor interviews.
  * **`(auth)` & `(public)`**: Clean card layouts for login/onboarding choices and public job search boards.

### 3. Organization Workspace & Employee Invite Flow
* **Super Admin / Recruiter Dashboard (`app/(dashboard)/`)**:
  * Display basic metrics (Active jobs, pending employees, total candidates).
  * **Employee Management**: Send invitation links with signed tokens. 
  * **Auto-Discovery Queue Table**: Display list of employees who signed up using the corporate email domain, with "Approve" or "Reject" actions.

### 4. Job Creation & Reusable Form Template Integration
* **Job Creation Wizard (`features/jobs/components/JobWizard.tsx`)**:
  * Inputs: Job title, scoping drop-downs (Business Unit, Branch, Department), description, status, employment type, experience level, salary range, location, remote type, skills (selected from skills library).
  * **Round Configurer**: Dynamic input to add/order rounds (e.g. Round 1: Coding, Round 2: Architecture) and assign specific interviewers (linked via `JobRoundInterviewer` table).
  * **Custom Questions**: Option to define extra custom form fields stored as a JSON schema in the applicant responses.

### 5. Public Job Board & Application Portal
* Public Landing Page (`app/page.tsx`): Displays all `Active` jobs across organizations.
* **Smart Filter**: Search by title, department, or location.
* Candidate Job Application Page: Supports saving application draft (`Draft` status), allowing candidates to resume and finish application and pre-screening at a later point. Renders standard contact details, social links, permits, background questions, and custom fields.

---

## Phase 2: Resume Parsing & AI Screening
**Goal**: Implement the smart application flow with resume parsing, AI-driven voice pre-screening, and the AI Coding Arena.

### 1. Resume Parser Engine
* Candidate uploads PDF resume.
* Backend calls Gemini API (`@google/generative-ai`) sending the PDF blob.
* Gemini parses content and returns structured JSON (Contact, Experience, Skills, Education).
* The form on the page is automatically populated with this JSON, allowing the candidate to review and submit.

### 2. Conversational Voice Screening Room
* Once a candidate applies, they enter the **AI Voice Screening Room**.
* **Recording UI (`features/screening/components/VoiceRoom.tsx`)**:
  * Web Audio API tracks candidate speech.
  * When a candidate finishes an answer, the audio chunk is transcribed (using speech-to-text API or Gemini Audio processing).
  * Gemini reviews the answer, generates the next verbal question based on the job description, and provides real-time assessment scores.

### 3. AI Coding Arena
* For software roles, candidates open the **Coding Arena** (Web IDE using **Monaco Editor**).
* **Virtual Code Compiler Flow**:
  * Candidates write solutions for coding tasks.
  * Upon hitting "Submit", the system packages candidate code, problem statement, and hidden test cases.
  * Calls Gemini API to dry-run and evaluate.
  * Gemini returns structured JSON containing:
    * Test-case results: `[{ "id": 1, "passed": true }, { "id": 2, "passed": false, "error": "Expected X got Y" }]`.
    * Correctness and style percentage scores.
* **Frontend Web Arena**:
  * If a candidate selects HTML/CSS/React tasks, render a sandboxed `iframe` runner (e.g. Sandpack).
  * Candidate sees live changes, and Gemini reviews the final source code structure for grading.

### 4. Qualification Logic
* A qualification dashboard checks if Candidate Score >= 60%.
* Candidates crossing the threshold are marked as `Qualified` and highlighted in the Recruiter dashboard.

### 5. Automated Reminders Queue
* Implement a background worker queue (using BullMQ or cron triggers) that detects applications stuck in `Draft` or `Applied` (incomplete screening) state for more than 24 hours.
* Dispatches email notifications via Resend prompting the candidate to complete their pending form and pre-screening rounds.

---

## Phase 3: Live Collaborative Interview Room
**Goal**: Build the in-app WebRTC video calling engine, synchronized code editor, and the interviewer’s evaluation center.

### 1. WebRTC Live Video Engine
* Integrate **LiveKit SDK** (highly scalable WebRTC server).
* Create a secure video/audio meeting layout in `features/interview/components/InterviewRoom.tsx`:
  * Supports multiple panels (Interviewer video feeds, candidate video feed, screensharing stream).
  * Multi-party rooms matching candidate and interviewer tokens.

### 2. Synchronized Live Editor & Canvas
* Embed Monaco Editor in the meeting room.
* Synchronize editor content in real-time across candidate and interviewers using WebSockets (Socket.io or LiveKit data channels).
* Allow selecting programming languages on the fly, with compile triggers and execution feedback.

### 3. Interviewer Notepad & Scorecard
* Sidebar panel visible ONLY to interviewers.
* HR/Interviewers can take real-time markdown notes during the interview.
* Save notes to `InterviewRecord` model, making them accessible to subsequent interviewers in the pipeline.

### 4. Interview AI Assistant
* AI reviews the candidate's resume and current job context, suggesting targeted interview questions to the interviewer.
* Suggests sub-questions or prompts if the candidate struggles.

---

## Phase 4: Integrations, Billing & Scalability
**Goal**: Connect calendar APIs, set up Stripe subscription models, configure caching layers, and deployment.

### 1. Google Calendar Integration & Auto-Scheduling
* Recruiter/Interviewer connects their Google Calendar via OAuth 2.0.
* **Auto-Scheduler Engine**:
  * Finds free slots matching candidate and interviewer calendar schedules.
  * Automatically schedules a meeting room and emails calendar invitations with join links.

### 2. Stripe Subscriptions
* Implement Stripe billing endpoints inside `features/billing/actions/`:
  * Create subscription checkouts for Pro ($149/mo) and Enterprise (custom).
  * Webhook listener to update the organization's `Subscription` status and active `Plan` link on payment events.
  * Enforce feature limitations at server layout levels (e.g., block job creation if active job count > tier limit).

### 3. Job Board Syndication & Connections
* Build OAuth connection pages for LinkedIn and Indeed, and API Key integration page for Naukri (saving encrypted credentials to the `JobBoardConnection` table).
* Create check-boxes in the job creation/edit wizard to allow recruiters to select connected syndication boards.
* Create BullMQ jobs that pick up new job posts and use the connected connections to sync the job description with external platforms, recording the resulting external IDs in the `JobBoardPost` model.

### 4. Redis Caching & Connection Poolers
* Use Redis to store session caches and cache public job listings to minimize database query latency.
* Connect database through Prisma Accelerate or Supabase Connection Pooler to avoid database exhaustion.

### 5. Background Queues (BullMQ)
* Setup BullMQ workers to run heavy tasks in the background:
  * Parse resume PDFs in worker threads.
  * Dispatch bulk notifications.
  * Execute background job board distribution APIs.
