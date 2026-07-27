import { router } from "../trpc"
import { authRouter } from "./auth-router"
import { organizationRouter } from "./organization-router"
import { dashboardRouter } from "./dashboard-router"
import { jobsRouter } from "./jobs-router"
import { candidatesRouter } from "./candidates-router"

export const appRouter = router({
  auth: authRouter,
  organization: organizationRouter,
  dashboard: dashboardRouter,
  jobs: jobsRouter,
  candidates: candidatesRouter,
})

export type AppRouter = typeof appRouter

