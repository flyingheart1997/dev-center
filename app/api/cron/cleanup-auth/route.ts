import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cleanupAuthData } from "@/features/auth/services/cleanup.service"

export async function GET(request: NextRequest) {
  return handleCleanup(request)
}

export async function POST(request: NextRequest) {
  return handleCleanup(request)
}

async function handleCleanup(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get("authorization")
    const headerSecret = request.headers.get("x-cron-secret")
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null

    if (bearerToken !== cronSecret && headerSecret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 })
    }
  }

  const result = await cleanupAuthData(prisma)

  if (!result) {
    return NextResponse.json({ error: "Failed to execute cleanup background job." }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: "Background auth cleanup completed successfully.",
    stats: result,
  })
}
