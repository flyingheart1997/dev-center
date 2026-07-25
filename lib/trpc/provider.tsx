"use client"

import React, { useState } from "react"
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query"
import { httpBatchLink, TRPCClientError } from "@trpc/client"
import { signOut } from "next-auth/react"
import superjson from "superjson"
import { trpc } from "./client"
import { getAppUrl } from "@/lib/utils/url-utils"

function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  return getAppUrl()
}

function handleGlobalUnauthorized(error: unknown) {
  if (typeof window === "undefined") return
  if (error instanceof TRPCClientError && (error.data?.code === "UNAUTHORIZED" || error.data?.httpStatus === 401)) {
    signOut({ callbackUrl: "/login?error=SessionExpired" })
  }
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleGlobalUnauthorized,
        }),
        mutationCache: new MutationCache({
          onError: handleGlobalUnauthorized,
        }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
