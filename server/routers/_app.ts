import { router } from "../trpc"
import { authRouter } from "./auth-router"
import { organizationRouter } from "./organization-router"
import { dashboardRouter } from "./dashboard-router"

export const appRouter = router({
  auth: authRouter,
  organization: organizationRouter,
  dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
