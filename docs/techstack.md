# Dev-Center: Tech Stack Specifications

This document defines the complete technical stack, configurations, and frontend design guidelines chosen for `dev-center`.

---

## 1. Core Architecture & Infrastructure
* **Package Manager**: `pnpm` (Workspace mode enabled).
* **Framework**: **Next.js 16 (App Router)** + **React 19**.
* **Database**: **PostgreSQL** (Multi-tenant schema, row-level tenant isolation).
* **ORM**: **Prisma ORM** (TypeScript-first database access layer).

---

## 2. Authentication & Authorization
* **Provider**: **Auth.js (NextAuth v5)**.
* **Database Integration**: Prisma Adapter (User, Account, Session, VerificationToken stored locally).
* **Session Strategy**: JWT (JSON Web Tokens) with custom session claims (`organization_id`, `role`, `employee_status`).
* **Transactional Email**: **Resend** for onboarding, invites, and password resets.

---

## 3. State Management & API Communication
* **tRPC**: Type-safe API endpoints linking frontend queries/mutations to backend Prisma databases.
* **TanStack Query (React Query)**: For caching, synchronizing, and updating server state on the client-side.
* **Zustand**: For lightweight client-side local state management (e.g. managing live video streams, code editor panels, and current active interview state).

---

## 4. UI, Styling & Theme Guidelines
* **Core Styling**: **Tailwind CSS v4** + **shadcn/ui** default component presets.
* **Theme Management**: **next-themes** (System, Light, Dark).
* **Aesthetics Rule**: 
  * Keep the design **simple, minimalist, and clean** using default shadcn styling.
  * **Do NOT introduce new arbitrary color palettes or extra complex design modifications**. 
  * Stick directly to the standard light/dark mode shades provided by the Tailwind v4 template.

---

## 5. Real-Time & Audio/Video Collaboration
* **WebRTC Server**: **LiveKit** (handles video, audio streams, and screensharing).
* **WebSockets**: Custom socket connections (or LiveKit data channels) for real-time collaborative code editor synchronization.

---

## 6. AI & Assessment Engines
* **Gemini API (`@google/generative-ai`)**:
  * **Resume Parsing**: Structured JSON extraction.
  * **Conversational voice pre-screening**: Auditing audio responses.
  * **Virtual Compiler**: Executes code statically against hidden test cases.
* **Client-Side Sandbox (Sandpack)**: For UI-based React/HTML coding tests.
