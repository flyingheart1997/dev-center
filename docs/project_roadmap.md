# Dev-Center: Detailed Development Roadmap & Phases

This roadmap outlines the implementation schedule, architectural steps, database setups, and verification processes for each phase of the `dev-center` interview platform.

---

## Phase 1: Core Portal, Multi-Tenant Auth & ATS
**Goal**: Build the multi-tenant base, credentials/OAuth onboarding, role-based controls, employee invite dashboard, and custom job pipelines.

### 1. Database Setup & Prisma Schema
* Define standard models in `prisma/schema.prisma`:
  * `Organization`: Details subscription tier, custom domain, and name.
  * `Employee`: Links user to an organization, role (`Admin`, `Recruiter`, `Interviewer`), and status (`Active`, `Pending`).
  * `Job`: Custom forms definition (`custom_form_fields` JSON), state (`Draft`, `Active`, `Completed`), and settings.
  * `JobRound`: Defines interview sequence, orders, and designated interviewers.
  * NextAuth standard tables: `User`, `Account`, `Session`, `VerificationToken` linked via Prisma adapter.

### 2. Custom NextAuth.js Configuration
* Setup `auth.ts` under `features/auth/` (Auth.js v5):
  * Configure Credentials provider, Google OAuth, GitHub OAuth, and LinkedIn OAuth.
  * Setup callbacks to attach `organization_id`, `role`, and `employee_status` to the JWT token and session cookies.
  * Block login if an employee is in the `Pending` queue until approved.
  * Setup transactional email validation using **Resend** for onboarding.

### 3. Organization Workspace & Employee Invite Flow
* **Super Admin / Recruiter Dashboard (`app/(dashboard)/`)**:
  * Display basic metrics (Active jobs, pending employees, total candidates).
  * **Employee Management**: Send invitation links with signed tokens. 
  * **Auto-Discovery Queue Table**: Display list of employees who signed up using the corporate email domain, with "Approve" or "Reject" actions.

### 4. Job Creation & Custom Questionnaire Builder
* **Job Creation Wizard (`features/jobs/components/JobWizard.tsx`)**:
  * Inputs: Job title, department, description, status.
  * **Round Configurer**: Dynamic input to add/order rounds (e.g. Round 1: Coding, Round 2: Architecture) and assign specific interviewers from the organization's employee list.
  * **Form Questionnaire Builder**: Checkboxes/toggles to select screening templates:
    * *Ex-employee confirmation*
    * *Visa status & sponsorship requirements*
    * *Criminal background check disclosures*
    * *Custom written questions (text areas)*
  * Save fields as structured JSON in `Job.custom_form_fields`.

### 5. Public Job Board & Application Portal
* Public Landing Page (`app/page.tsx`): Displays all `Active` jobs across organizations.
* **Smart Filter**: Search by title, department, or location.
* Candidate Job Application Page: Renders standard forms + custom questionnaires defined by the recruiter.

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
  * Webhook listener to update the organization's tier inside `Organization.subscription_tier` on payment events.
  * Enforce feature limitations at server layout levels (e.g., block job creation if active job count > tier limit).

### 3. Redis Caching & Connection Poolers
* Use Redis to store session caches and cache public job listings to minimize database query latency.
* Connect database through Prisma Accelerate or Supabase Connection Pooler to avoid database exhaustion.

### 4. Background Queues (BullMQ)
* Setup BullMQ workers to run heavy tasks in the background:
  * Parse resume PDFs in worker threads.
  * Dispatch bulk notifications.
  * Handle job syndication to LinkedIn / Naukri APIs.
