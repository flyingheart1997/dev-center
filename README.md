# Dev-Center: Recruitment, Pre-Screening & Interview Platform

`dev-center` is a multi-tenant recruitment and assessment platform that consolidates Applicant Tracking (ATS), automatic job distribution, AI-driven pre-screening (voice & coding), and live collaborative interview rooms into a single ecosystem.

---

## 📖 Project Documentation & Roadmap

To understand the architecture, guidelines, and implementation steps, refer to the following documentation files:

* **[Product Specification](file:///Users/koushikmondal/dev-center/docs/dev_center_product_specification.md)**: Product details, competitor analysis, multi-tenant databases, custom templates, and AI coding compiler design.
* **[Development Roadmap](file:///Users/koushikmondal/dev-center/docs/project_roadmap.md)**: Phase-by-phase implementation details including database design, screen setups, and integration plans.
* **[Technical Stack Specs](file:///Users/koushikmondal/dev-center/docs/techstack.md)**: Details on framework, ORM, state management (Zustand, tRPC, React Query), WebRTC, and UI guidelines.
* **[Agent Instructions & Rules](file:///Users/koushikmondal/dev-center/AGENTS.md)**: Coding guidelines, folder structures, and multi-tenant policies that AI coding assistants must adhere to.

---

## 🛠️ Tech Stack Overview

* **Frontend**: Next.js 16 (App Router) + React 19 + next-themes
* **Styles**: Tailwind CSS v4 + shadcn/ui (Strict minimalist light/dark theme)
* **Database & ORM**: PostgreSQL + Prisma ORM
* **Authentication**: Auth.js (NextAuth v5) using Prisma Adapter & JWT Strategy
* **APIs & State**: tRPC + TanStack Query (React Query) + Zustand
* **Realtime Collaboration**: LiveKit (WebRTC) + WebSockets
* **AI Evaluation**: Gemini API (`@google/generative-ai`)
* **Emails**: Resend

---

## 📂 Folder Architecture

This project follows a **Feature-Based (Modular) Layout** under `features/` (e.g., `features/auth/`, `features/jobs/`).
* Business logic, components, hooks, or actions specific to a domain **MUST** reside in their respective feature folders.
* The global `/components` and `/hooks` directories are reserved only for shared, atomic UI controls (e.g., shadcn inputs) and generic helpers.
* See [AGENTS.md](file:///Users/koushikmondal/dev-center/AGENTS.md) for detailed guidelines.

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start local development server:
   ```bash
   pnpm dev
   ```

3. Build production bundle:
   ```bash
   pnpm build
   ```
