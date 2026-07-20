import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/routers/_app"
import { createTRPCContext } from "@/server/trpc"
import { ZodError } from "zod"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext(),
    onError: ({ path, error, type, input }) => {
      const timestamp = new Date().toISOString()

      if (error.cause instanceof ZodError) {
        console.warn(`[tRPC Validation Error] [${timestamp}] Path: "${path ?? "unknown"}" | Type: ${type}`, {
          formattedErrors: error.cause.flatten(),
        })
        return
      }

      console.error(`[tRPC Error] [${timestamp}] Path: "${path ?? "unknown"}" | Code: ${error.code} | Message: ${error.message}`, {
        type,
        input: process.env.NODE_ENV === "development" ? input : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      })
    },
  })

export { handler as GET, handler as POST }
