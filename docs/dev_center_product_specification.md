# Dev-Center: Product Specification & Technical Architecture

`dev-center` is a highly scalable, multi-tenant recruitment, AI-screening, and live collaborative interview platform. It solves the fragmentation of hiring tools by consolidating Applicant Tracking (ATS), smart job boards, AI voice/coding assessments, and in-app video/coding rooms into one unified experience.

---

## 1. Product Refinements (Based on User Feedback)

### A. Auto-Discovery via Domain Verification & Approval Queue
* When an employee registers with a corporate email (e.g. `user@tcs.com`), they are not immediately given access to the TCS workspace.
* Instead, they are placed in a **Pending Approval Queue** inside the Organization's Admin console.
* The workspace Super Admin/HR gets a notification to approve or reject the user, ensuring strict enterprise security.

### B. Candidate Portal & AI Job Recommendations ("AI Everywhere")
* Candidates have a dedicated portal where they can browse and search open jobs posted by different organizations.
* **AI Matchmaking Engine**: The system parses the candidate's profile/resume and automatically recommends jobs that match their skills, experience level, and preferred roles.
* Candidates can track application progress (e.g., "Round 2: Technical Interview"), view scheduled slots, and update profiles.

### C. Customized Job Application Forms & Templates
* When creating a job, the recruiter decides how many rounds are required.
* To gather extra screening details, recruiters can select from **Predefined Custom Form Templates** or add custom questions:
  * *Ex-employee status verification*
  * *Visa status & sponsorship requirements*
  * *Country-specific background check authorizations*
  * *Criminal disclosures or general declarations*
* These custom questions are appended to the applicant’s initial application form.

### D. Dual-Arena Coding Test & Compiler Setup
The coding arena supports two distinct evaluation pipelines depending on the language/framework being tested:

1. **Backend / General Purpose Languages (Python, Go, Java, C++, JS scripting, etc.)**:
   * Uses the **Gemini API as a Virtual Compiler**.
   * On submit, candidate code, problem description, and test cases are sent to Gemini.
   * Gemini executes virtual evaluation and returns a structured JSON payload detailing the status of every individual test case (e.g., `TestCase 1: Passed`, `TestCase 2: Failed [expected X, got Y]`), overall logical correctness, complexity, and grading.
2. **Frontend Frameworks & Web UI (React, HTML, CSS, Vanilla JS)**:
   * Uses an in-browser client-side runtime sandboxed runner (such as **Sandpack by CodeSandbox** or standard sandboxed `iframes`).
   * This provides a live, interactive preview panel of the UI candidate is building.
   * Real-time rendering is done client-side. The code is then analyzed by Gemini for structure, clean component breakdown, styling logic, and best practices to provide a grading score.

---

## 2. Project Folder Architecture

To ensure high scalability, micro-level code ownership, and ease of maintenance as the application grows, we will follow a **Feature-Based (Modular) Architecture** combined with Next.js App Router conventions:

```
dev-center/
├── app/                      # Next.js Routes (Pages, Layouts, API Route handlers)
│   ├── (auth)/               # Route Group for Authentication (Login, Register)
│   ├── (dashboard)/          # Route Group for Organization/Employee Dashboards
│   ├── (candidate)/          # Route Group for Candidate Portal
│   ├── api/                  # Global API Route Handlers (Webhooks, LiveKit tokens)
│   ├── layout.tsx            # Global Layout
│   └── page.tsx              # Public Landing / Job Board Page
│
├── features/                 # Domain-Specific Modules (Self-contained logic)
│   ├── auth/                 # Authentication features (NextAuth callbacks, custom middleware)
│   ├── jobs/                 # Job posting, status toggle, custom question templates
│   ├── screening/            # AI Verbal screening & AI Virtual Compiler pipelines
│   ├── interview/            # Live WebRTC Meeting Room, Monaco editor, Interviewer notes
│   ├── billing/              # Stripe Checkouts, Webhooks, Portal sessions
│   └── dashboard/            # Metrics charts, pending approval tables
│       # Inside each feature module:
│       ├── components/       # Feature-specific UI components (e.g. JobCard, VoiceRecorder)
│       ├── hooks/            # Feature-specific custom hooks (e.g. useVoiceTranscription)
│       ├── actions/          # Next.js Server Actions for database mutations
│       ├── types.ts          # Feature-specific TypeScript models
│       └── utils/            # Feature-specific utility helpers
│
├── components/               # Global & Shared UI Components (shadcn/ui elements)
│   ├── ui/                   # Reusable atomic controls (button, dialog, input, card)
│   └── shared/               # Composite shared components (navbar, sidebar, theme-toggle)
│
├── hooks/                    # Global Shared Hooks (useDebounce, useMediaQuery)
│   
├── lib/                      # Third-Party Client initializations & Helpers
│   ├── prisma.ts             # Prisma Database Client
│   ├── gemini.ts             # Gemini API Client
│   ├── livekit.ts            # LiveKit Server Client
│   ├── stripe.ts             # Stripe Helper functions
│   └── utils.ts              # Global utilities (cn class merging helper)
│
├── prisma/                   # Prisma ORM Schema & Database Migrations
│   └── schema.prisma
│
├── public/                   # Static Assets (Images, Icons, Fonts)
├── types/                    # Global TypeScript definitions
└── package.json
```

### Why this architecture?
* **High modulatity**: If we need to modify the Live Meeting room code, everything is in `features/interview/` instead of jumping between random global folders.
* **Separation of Concerns**: Global `components/` only contains generic visual blocks (atoms/molecules like button, select). Business logic is confined strictly inside `features/`.

---

## 3. Core Technology Stack

We will use a modern, developer-friendly, and highly scalable stack:

* **Package Manager**: `pnpm` (highly optimized workspace caching).
* **Frontend Framework**: **Next.js 16 (App Router)** with **React 19** (Server Components, Server Actions for form submissions, and Streaming).
* **Styling & UI**: **Tailwind CSS v4** + **shadcn/ui** components. Managed by **next-themes** (System, Light, Dark). 
  * *Aesthetics Rule*: Keep the UI clean, simple, and minimalist. Stick to standard shadcn presets and light/dark modes. **Do NOT add custom color palettes or extra style modifications**.
* **Database**: **PostgreSQL** (relational structures are perfect for ATS workflows, candidate states, and complex audit logs).
* **ORM**: **Prisma ORM** (type-safe queries, migration handling, and clean relations).
* **Authentication**: **Auth.js (NextAuth v5)** - *Self-Hosted Custom Auth*:
  * **Database Storage**: Uses **Prisma Adapter** to store all authentication schemas (`User`, `Account`, `Session`, `VerificationToken`) directly inside our PostgreSQL database (100% data ownership).
  * **Session Strategy**: **JWT (JSON Web Tokens)** strategy for zero-latency session checks on Next.js page requests (avoids recurring DB queries, highly scalable for millions of users).
  * **Providers**: Credentials provider (Email + Password), Google OAuth, GitHub OAuth, LinkedIn OAuth.
  * **Custom Verification Pipeline**: Uses **Resend** to send transactional OTP/magic link verification codes for onboarding and password-resets.
  * **Tenant Mapping**: Enforces custom JWT session claims to inject `organization_id` and role permissions directly inside token cookies, allowing rapid row-level validation.
* **State & API Layer**:
  * **tRPC**: For end-to-end type-safe API requests.
  * **TanStack Query (React Query)**: For server state management, caching, and background sync on the client.
  * **Zustand**: For lightweight client-side state management (handles active video panels, live code editing state, and interview states).
* **Realtime Communication & Live Video Room**:
  * **LiveKit**: WebRTC media server for video, audio, and screensharing. Highly scalable, handles multi-party rooms.
  * **WebSockets (Socket.io/Pusher)**: For collaborative text editing, instant messages, and real-time candidate assessment logs.
* **AI Engine**: **Gemini API** (`@google/generative-ai`) for parsing resumes, screening verbal questions, virtual code compiler, and job matching.

---

## 4. Subscription & Billing Model (Stripe)

To monetize the platform, we will implement a multi-tiered subscription model using **Stripe Billing**:

| Feature / Limit | Free / Starter | Pro (Growth) | Enterprise |
| :--- | :--- | :--- | :--- |
| **Pricing** | $0 / month | $149 / month | Custom Enterprise |
| **Active Job Posts** | Max 2 active jobs | Max 15 active jobs | Unlimited active jobs |
| **AI Screening Credits** | 10 candidates / month | 250 candidates / month | Custom quota / Unlimited |
| **Domain Auto-Queue** | ❌ (Manual invite only) | ✅ (Domain auto-queue) | ✅ (Auto-queue & SSO) |
| **Custom Templates** | Basic | Advanced templates | Fully custom templates |
| **Integrations** | Manual posting | Auto-post to LinkedIn/Naukri | API access & direct ATS sync |

---

## 5. Multi-Tenant Architecture & Database Schema

To scale to millions of users, `dev-center` uses a **Shared-Database, Single-Schema (Tenant Isolated)** design:

* Every workspace table contains an `organization_id` column.
* Database queries are always filtered by `organization_id` of the logged-in employee.
* Strict tenant checks are enforced at the API/Server Action level.

```mermaid
erDiagram
    ORGANIZATION ||--o{ EMPLOYEE : employs
    ORGANIZATION ||--o{ JOB : posts
    EMPLOYEE ||--o{ INTERVIEW : conducts
    JOB ||--o{ APPLICANT : receives
    JOB ||--o{ JOB_ROUND : defines
    APPLICANT ||--o{ SCREENING_SCORE : gets
    APPLICANT ||--o{ INTERVIEW : undergoes
    
    ORGANIZATION {
        string id PK
        string name
        string domain
        string subscription_tier
    }
    
    EMPLOYEE {
        string id PK
        string organization_id FK
        string name
        string email
        string role "Admin, Recruiter, Interviewer"
        string status "Active, Pending"
    }

    JOB {
        string id PK
        string organization_id FK
        string title
        string description
        string status "Draft, Active, Completed"
        jsonb custom_form_fields
    }

    JOB_ROUND {
        string id PK
        string job_id FK
        int order_index
        string title "System Design, HR, etc."
        string interviewer_ids "Array of Employee IDs"
    }

    APPLICANT {
        string id PK
        string job_id FK
        string name
        string email
        string status "Applied, Qualified, In-Interview, Hired, Rejected"
        string resume_url
        jsonb custom_form_responses
    }
```

---

## 6. Scalability Strategy

To handle high traffic loads (millions of users/candidates):

1. **Database Connection Pooling**: Use serverless connection poolers (like **Supabase Connection Pooler** or **Prisma Accelerate**) to prevent crashing under spike loads.
2. **Heavy-Weight Caching**: Use **Redis** to cache:
   * Active job postings on the public board.
   * User session data.
   * Real-time metadata for live interview rooms.
3. **Asynchronous Background Processing**:
   * Use a background worker library (like **BullMQ** with Redis or Serverless Edge functions) for slow operations:
     * Parsing PDFs/resumes using LLMs.
     * Sending email notifications to candidates/interviewers.
     * Pushing jobs to external boards (LinkedIn/Naukri).
4. **AI Cost Optimization**: Implement rate-limiting for candidate tests to prevent API spamming and control costs.
