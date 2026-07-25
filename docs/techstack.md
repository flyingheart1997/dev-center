# Dev-Center: Tech Stack Specifications

This document defines the complete technical stack, configurations, and frontend design guidelines chosen for `dev-center`.

---

## 1. Core Architecture & Infrastructure
* **Package Manager**: `pnpm` (Workspace mode enabled).
* **Framework**: **Next.js 16 (App Router)** + **React 19**.
* **Database**: **PostgreSQL** (Multi-tenant schema, row-level tenant isolation, `citext` for case-insensitive emails).
* **ORM**: **Prisma ORM** (TypeScript-first database access layer with native rate-limiting models).

---

## 2. Authentication & Authorization
* **Provider**: **Auth.js (NextAuth v5)** with custom Next.js 16 Edge Route Security Gateway (`proxy.ts`).
* **Database Integration**: Prisma Adapter (`User`, `Account`, `Session`, `VerificationToken`, `RateLimit`, and `AuditLog` stored in PostgreSQL).
* **Instant Token Invalidation & Versioning (`tokenVersion`)**: Any password change, user deletion, status update, or security reset increments `User.tokenVersion`, instantly invalidating active JWT tokens across all devices.
* **High-Performance `AuthCache` Layer (`lib/utils/auth-cache.ts`)**: Generic `AuthCache<T>` interface backed by a 30-second TTL LRU memory cache (`process.env.AUTH_CACHE_TTL || 30000` ms) using `user:${userId}:${tokenVersion}` keys to prevent database connection overload while guaranteeing near-instant security invalidation. Pluggable for Redis (Upstash) when scaling horizontally.
* **Lightweight Middleware Gateway (`proxy.ts`)**: Fast, stateless Edge middleware checking session presence and route access without heavy database lookups. Deep business logic and employee status checks (`PENDING_APPROVAL`, `SUSPENDED`) are enforced in tRPC `protectedProcedure`.
* **Soft Session Revocation & Device Management**: `Session` table enhanced with `userAgent`, `ipAddress`, `createdAt`, `lastSeenAt`, and `revokedAt DateTime?` for soft session revocation ("Logout Other Devices") without destroying forensic audit trails. Raw `userAgent` stored and dynamically parsed in the UI.
* **Type-Safe Security Audit Logging (`AuditLog` + `AuditEvent`)**: `AuditLog` model updated with `AuditEvent` enum (`PASSWORD_CHANGED`, `ROLE_CHANGED`, `SESSION_REVOKED`, `USER_DISABLED`, `MEMBER_INVITED`, `EMPLOYEE_STATUS_CHANGED`, `EMAIL_VERIFIED`, `ORGANIZATION_CREATED`) capturing both User and Employee security events.
* **Global 401 Client Interceptor (`lib/trpc/provider.tsx`)**: Global QueryCache/MutationCache error handling catches 401 `UNAUTHORIZED` responses and automatically invokes `signOut({ callbackUrl: "/login?error=SessionExpired" })` to kick invalid/deleted users to the login screen without requiring a manual browser refresh.
* **Background Auth Cleanup Cron (`/api/cron/cleanup-auth`)**: Protected API endpoint (secured via `CRON_SECRET`) executing modular purges for expired tokens, rate limits, invitations, and sessions.
* **Session Strategy**: JWT (JSON Web Tokens) with custom claims (`organization_id`, `employee_id`, `candidate_id`, `role`, `emailVerified`, `tokenVersion`).
* **5-Stage Auth Lifecycle**:
  * **Progressive 2-Step Registration (`/register`)**: Step 0 Intent Choice -> Step 1 Email check (`checkEmailExists`) & Social Auth -> Step 2 Credentials.
  * **Email Verification Gate**: Unverified users (`emailVerified === null`) strictly routed to `/verify-email`.
  * **Organization Setup (`/setup-org`)**: Org Founders set up Company Name, Domain, Website, LinkedIn, Industry, and HQ Location.
  * **Tokenized Employee Invites**: Team members join strictly via signed invitation tokens (`/register?inviteToken=xyz`).
* **3NF Identity Normalization**: `User` model acts as single source of truth for identity & contact details (`phone`, `location`, `linkedinUrl`, `githubUrl`, `portfolioUrl`, `resumeUrl`, `tokenVersion`, `lastPasswordChangedAt`), while `Candidate` and `Employee` hold domain-specific relations.
* **Transactional Email Engine**: **Resend** for email verification links, 6-digit OTP codes, invitation links, and password resets.

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
