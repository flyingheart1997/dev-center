import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { getServerSession } from "next-auth"
import { EmployeeRole } from "@/types/enums"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createTRPCContext() {
  const session = await getServerSession(authOptions)
  return {
    session,
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    })
  }

  if (!ctx.session.user.emailVerified) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Please verify your email address before continuing.",
    })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const userRole = ctx.session.user.role as EmployeeRole | undefined
  const allowedRoles = [EmployeeRole.OWNER, EmployeeRole.GLOBAL_ADMIN]

  if (!userRole || !allowedRoles.includes(userRole)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin or Owner permissions are required for this action.",
    })
  }

  return next({ ctx })
})
