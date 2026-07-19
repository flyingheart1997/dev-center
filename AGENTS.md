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
│   ├── jobs/                 # Job posts, custom form questions & templates
│   ├── screening/            # AI voice and coding arena virtual compiles
│   ├── interview/            # Live WebRTC rooms, shared editor, notes
│   ├── billing/              # Stripe Checkouts and Webhooks
│   └── dashboard/            # Admin metrics & employee approval queues
│       # Inside each feature: components/, hooks/, actions/, types.ts, utils/
│
├── components/               # Global atomic/molecule UI elements only (shadcn ui/)
├── hooks/                    # Global generic hooks only (useDebounce, useMediaQuery)
├── lib/                      # Third-party client instances (prisma, gemini, stripe)
└── prisma/                   # Database schema definitions and migrations
```

### Modularity Rule:
* **Never** place business-specific logic, components, or hooks into the root `components/` or `hooks/` directories.
* All feature components (e.g. `JobCard`, `VoiceRecorder`, `Scorecard`) must reside in their respective module folder under `features/<module_name>/components/`.

---

## 4. Coding & Security Guidelines

### A. Multi-Tenant Isolation
* Every database table containing workspace-specific data **must** have an `organization_id` column.
* All queries (Prisma/PostgreSQL) **must** filter by the current logged-in employee's `organization_id` extracted from the NextAuth JWT session. Never leak cross-tenant data.

### B. Dual-Arena Assessment Pipeline
* **Backend Coding (Python, Java, Go, etc.)**: Do not build heavy local Docker compilers. Use the **Gemini API as a Virtual Compiler**. Pass the problem statement, code, and inputs/outputs to Gemini and expect case-by-case verification JSON (`TestCase 1: Passed`, etc.).
* **Frontend Coding (HTML, CSS, React)**: Render code inside a sandboxed client-side runtime (like Sandpack) for visual output, and send the source tree to Gemini for structure/quality assessment.

### C. Onboarding & Invites
* Do not auto-approve users into workspaces blindly. Use verification email loops (Resend) and place employees in a **Pending Approval Queue** inside the Organization's dashboard until explicitly approved by an Org Admin.

### D. Next.js 16 & React 19 Handling
* Heed Next.js 16 breaking changes. Read files under `node_modules/next/dist/docs/` before making routing or layout modifications.
* Ensure code is compatible with React 19 canary APIs and does not trigger deprecation warnings.

### E. UI & Styling Theme Guidelines
* Keep the user interface clean, simple, and minimalist. Stick to standard shadcn presets and light/dark modes.
* **Do NOT add custom color palettes or extra style modifications**.

### F. Package Manager Enforcement
* Always use **`pnpm`** for adding dependencies, executing builds, or managing node modules.
* **Never** use npm or yarn. Workspace flags and locks are configured for `pnpm`.

### G. Workspace Skills & Up-to-Date APIs
* To prevent outdated API compilation errors (since Next.js 16, React 19, Auth.js v5, tRPC, and Zustand have evolved rapidly), **DO NOT rely on default pre-trained LLM knowledge**.
* You must read and follow the custom official agent skills located in the workspace under:
  * Auth.js (NextAuth): [.agents/skills/nextjs-auth/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/nextjs-auth/SKILL.md)
  * Zustand State: [.agents/skills/zustand/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/zustand/SKILL.md)
  * Resend Email: [.agents/skills/resend/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/resend/SKILL.md)
  * Prisma ORM:
    * Prisma Client API: [.agents/skills/prisma/prisma-client-api/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-client-api/SKILL.md)
    * Prisma CLI: [.agents/skills/prisma/prisma-cli/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-cli/SKILL.md)
    * Prisma Postgres: [.agents/skills/prisma/prisma-postgres/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/prisma/prisma-postgres/SKILL.md)
  * Postgres (Supabase): [.agents/skills/supabase-postgres-best-practices/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/supabase-postgres-best-practices/SKILL.md)
  * TanStack AI:
    * Core: [.agents/skills/tanstack-ai/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/SKILL.md)
    * Chat Experience: [.agents/skills/tanstack-ai/chat-experience/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/chat-experience/SKILL.md)
    * Tool Calling: [.agents/skills/tanstack-ai/tool-calling/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/tool-calling/SKILL.md)
    * Media Generation: [.agents/skills/tanstack-ai/media-generation/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/media-generation/SKILL.md)
    * Structured Outputs: [.agents/skills/tanstack-ai/structured-outputs/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/structured-outputs/SKILL.md)
    * Adapter Configuration: [.agents/skills/tanstack-ai/adapter-configuration/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/adapter-configuration/SKILL.md)
    * AG-UI Protocol: [.agents/skills/tanstack-ai/ag-ui-protocol/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/ag-ui-protocol/SKILL.md)
    * Middleware: [.agents/skills/tanstack-ai/middleware/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/middleware/SKILL.md)
    * Custom Backend: [.agents/skills/tanstack-ai/custom-backend-integration/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/custom-backend-integration/SKILL.md)
    * Debug Logging: [.agents/skills/tanstack-ai/debug-logging/SKILL.md](file:///Users/koushikmondal/dev-center/.agents/skills/tanstack-ai/debug-logging/SKILL.md)

