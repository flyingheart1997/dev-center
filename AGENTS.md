<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dev-Center: Agent Instructions & Development Guidelines

Welcome to the `dev-center` workspace. Before writing any code or proposing plans, you **MUST** read this file to understand the architecture, tech stack, and development guidelines.

For full project details, reference these documents:
* **[Product Specification](file:///Users/koushikmondal/dev-center/docs/dev_center_product_specification.md)**
* **[Development Roadmap](file:///Users/koushikmondal/dev-center/docs/project_roadmap.md)**
* **[Technical Stack Specifications](file:///Users/koushikmondal/dev-center/docs/techstack.md)**

---

## 1. Project Overview
`dev-center` is a multi-tenant SaaS recruitment platform that consolidates Applicant Tracking (ATS), AI-driven pre-screening (verbal + coding), and live collaborative interview rooms (video calls + shared code editors) into a single ecosystem.

## 2. Core Tech Stack
* **Package Manager**: `pnpm` (workspace mode enabled).
* **Framework**: Next.js 16 (App Router) + React 19 (Server Components, Server Actions).
* **Styles & Theme**: Tailwind CSS v4 + shadcn/ui. Managed by **next-themes** (System, Light, Dark).
* **Database & ORM**: PostgreSQL + Prisma ORM.
* **Authentication**: Auth.js (NextAuth v5) using **Prisma Adapter** (all data in our PostgreSQL DB) and **JWT Strategy** for session resolution. Custom claims: `organization_id` & `role`.
* **State & API Layer**: **tRPC** (type-safe APIs), **TanStack Query** (server state sync/cache), and **Zustand** (lightweight client-side states).
* **Form & Validation Layer**: **React Hook Form** + **Zod** (`@hookform/resolvers/zod`).
* **Realtime/WebRTC**: LiveKit (video, audio, screen share) + WebSockets (collaborative editors/chat).
* **AI Engine**: Gemini API (`@google/generative-ai`) for resume parsing, voice screening, virtual compiling, and job recommendations.
* **Transactional Email**: Resend.

---

## 3. Directory & Folder Architecture
We follow a **Feature-Based (Modular) Folder Architecture** to isolate domains. Do not clutter global folders.

```
dev-center/
├── app/                      # Routing layers only (Layouts, Pages, APIs)
├── features/                 # Self-contained business modules
│   ├── auth/                 # NextAuth callbacks, Resend tokens
│   │   ├── components/       # Feature UI presentation components
│   │   ├── hooks/            # Feature hooks (React Hook Form + tRPC mutations)
│   │   ├── schemas/          # Shared Zod validation schemas
│   │   └── store/            # Feature Zustand stores
│   ├── candidate-prep/       # Candidate AI voice mock arena, ATS resume studio, coding practice
│   ├── organization/         # Organization, BusinessUnits, Branches, Departments, Members
│   ├── jobs/                 # Job posts, applications, approvals & standard forms
│   ├── screening/            # AI voice and coding arena virtual compiles
│   ├── interview/            # Live WebRTC rooms, shared editor, notes
│   ├── billing/              # Stripe Checkouts and Webhooks
│   └── dashboard/            # Admin metrics & employee approval queues
│
├── components/               # Global UI components
│   ├── ui/                   # Atomic shadcn/ui primitives
│   └── templates/            # Email & document templates
│       └── email-templates/  # Modular transactional email HTML templates
├── hooks/                    # Global generic hooks only (useDebounce, useMediaQuery)
├── lib/                      # Third-party client instances (prisma, gemini, resend, trpc)
├── types/                    # Global TypeScript definitions & enums (types/enums.ts)
└── prisma/                   # Database schema definitions and migrations
```

### Naming & Modularity Rules:
* **Strict Kebab-Case File & Directory Naming**: ALL files and directories **must** follow `kebab-case` (e.g., `auth-provider.tsx`, `theme-toggle.tsx`, `candidate-prep`, `auth-schemas.ts`). **NEVER** use camelCase (e.g. `authActions.ts`), PascalCase (e.g. `AuthProvider.tsx`), or mixed casing for file/folder names.
* **Mandatory shadcn/ui Component Usage**: ALWAYS audit and use pre-installed **shadcn/ui primitives** (`@/components/ui/*`) for all UI controls (e.g., `InputOTP` for pin/OTP verification, `Button`, `Card`, `Input`, `Label`, `Tabs`, `Badge`, `Alert`, `Dialog`, `DropdownMenu`, `Avatar`, `Table`, `Sheet`, `Sidebar`, `Tooltip`). **NEVER** write raw HTML `<button>`, `<input>`, or basic inputs when a specialized shadcn component exists.
* **Shared Zod Validation Schemas**:
  * ALWAYS define Zod schemas inside feature schema files (`features/<module>/schemas/<module>-schemas.ts`).
  * BOTH client-side forms (`useForm({ resolver: zodResolver(schema) })`) AND server-side tRPC procedures (`procedure.input(schema)`) MUST consume the EXACT SAME shared Zod schema. Zero duplicated validation logic.
* **Strict Separation of View & Business Logic**:
  * Pages (`app/*`) and UI Components MUST remain ultra-clean presentation templates. **NEVER** write inline state logic, form submit handlers, or API calls inside page/component views.
  * All interactive logic, state handlers, and React Hook Form instances MUST reside in dedicated feature hooks (`features/<module>/hooks/*`).
  * State management MUST use **Zustand** stores (`features/<module>/store/*`).
  * Feature helper and utility functions MUST reside in dedicated module utils (`features/<module>/utils/*`).
* **Never** place business-specific logic, components, or hooks into the root `components/` or `hooks/` directories.

---

## 4. Coding & Security Guidelines

### A. Multi-Tenant Isolation
* Every database table containing workspace-specific data **must** have an `organization_id` column.
* All queries (Prisma/PostgreSQL) **must** filter by the current logged-in employee's `organization_id` extracted from the NextAuth JWT session. Never leak cross-tenant data.

### B. Dynamic Application URL Resolution
* **NEVER** hardcode `"http://localhost:3000"` or raw string URLs anywhere in the codebase (routers, templates, client providers, email links).
* ALWAYS import and call `getAppUrl()` from `@/lib/utils/url-utils`.

### C. Strict Prisma Enum Enforcement
* **NEVER** use raw string literals (e.g. `"Owner"`, `"Admin"`, `"Interviewer"`, `"Active"`, `"Pending_Approval"`) for roles or statuses.
* ALWAYS import official Enums directly from `@/types/enums` (`EmployeeRole.OWNER`, `EmployeeRole.GLOBAL_ADMIN`, `EmployeeStatus.ACTIVE`, `EmployeeStatus.PENDING_APPROVAL`, `JobStatus`, `InterviewStatus`).

### D. Centralized Transactional Email Engine
* **NEVER** write inline HTML template strings inside API routes, server actions, or tRPC procedures.
* ALWAYS build dynamic email template components inside `components/templates/email-templates/` (using `base-email-layout.ts`) and send via `sendTransactionalEmail()` in `@/lib/resend`.

### E. Unified API Layer (tRPC + TanStack Query)
* ALL backend API operations MUST be exposed as tRPC procedures under `server/routers/*`.
* Client-side components and custom hooks MUST invoke procedures via `trpc.<router>.<procedure>.useMutation()` or `trpc.<router>.<procedure>.useQuery()`.
* Do NOT create random REST routes or un-typed server actions (except external webhooks like Stripe/Resend).

### F. Dual-Arena Assessment Pipeline
* **Backend Coding (Python, Java, Go, etc.)**: Do not build heavy local Docker compilers. Use the **Gemini API as a Virtual Compiler**. Pass the problem statement, code, and inputs/outputs to Gemini and expect case-by-case verification JSON (`TestCase 1: Passed`, etc.).
* **Frontend Coding (HTML, CSS, React)**: Render code inside a sandboxed client-side runtime (like Sandpack) for visual output, and send the source tree to Gemini for structure/quality assessment.

### G. Onboarding & Invites
* Do not auto-approve users into workspaces blindly. Use verification email loops (Resend) and place employees in a **Pending Approval Queue** inside the Organization's dashboard until explicitly approved by an Org Admin.

### H. UI & Styling Theme Guidelines
* Keep the user interface clean, simple, and minimalist. Stick to standard shadcn presets and light/dark modes.
* **Do NOT add custom color palettes or extra style modifications**.

### I. Package Manager Enforcement
* Always use **`pnpm`** for adding dependencies, executing builds, or managing node modules.
* **Never** use npm or yarn. Workspace flags and locks are configured for `pnpm`.

### J. Workspace Skills & Up-to-Date APIs
* To prevent outdated API compilation errors (since Next.js 16, React 19, Auth.js v5, tRPC, and Zustand have evolved rapidly), **DO NOT rely on default pre-trained LLM knowledge**.
* You must read and follow the custom official agent skills located in the workspace under:
  * Auth.js (NextAuth): [.agents/skills/nextjs-auth/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/nextjs-auth/SKILL.md)
  * Zustand State: [.agents/skills/zustand/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/zustand/SKILL.md)
  * Resend Email: [.agents/skills/resend/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/resend/SKILL.md)
  * Prisma ORM:
    * Prisma Client API: [.agents/skills/prisma/prisma-client-api/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-client-api/SKILL.md)
    * Prisma CLI: [.agents/skills/prisma/prisma-cli/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-cli/SKILL.md)
    * Prisma Postgres: [.agents/skills/prisma/prisma-postgres/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-postgres/SKILL.md)
