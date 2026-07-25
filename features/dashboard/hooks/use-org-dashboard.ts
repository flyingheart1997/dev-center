"use client"

import { trpc } from "@/lib/trpc/client"

export function useOrgDashboard() {
  const query = trpc.dashboard.getOrgDashboardMetrics.useQuery(undefined, {
    staleTime: 1000 * 30, // 30s cache
    refetchOnWindowFocus: true,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
