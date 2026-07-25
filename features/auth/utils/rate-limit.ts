import { PrismaClient } from "@/prisma/generated/client"
import { TRPCError } from "@trpc/server"

export async function checkRateLimit(
  prisma: PrismaClient,
  key: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000
) {
  const now = new Date()

  const existing = await prisma.rateLimit.findUnique({ where: { key } })

  if (existing) {
    if (existing.expiresAt < now) {
      await prisma.rateLimit.update({
        where: { key },
        data: { points: 1, expiresAt: new Date(now.getTime() + windowMs) },
      })
      return
    }

    if (existing.points >= maxRequests) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please try again later.",
      })
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { points: { increment: 1 } },
    })
  } else {
    await prisma.rateLimit.create({
      data: {
        key,
        points: 1,
        expiresAt: new Date(now.getTime() + windowMs),
      },
    })
  }
}

const MAX_FAILED_ATTEMPTS = 4
const LOCKOUT_DURATION_MS = 60 * 60 * 1000 // 1 hour

export async function checkAndIncrementFailedLogins(prisma: PrismaClient, email: string) {
  const key = `failed-login:${email.toLowerCase()}`
  const now = new Date()

  const existing = await prisma.rateLimit.findUnique({ where: { key } })

  if (existing) {
    if (existing.expiresAt < now) {
      await prisma.rateLimit.update({
        where: { key },
        data: { points: 1, expiresAt: new Date(now.getTime() + LOCKOUT_DURATION_MS) },
      })
      return
    }

    if (existing.points >= MAX_FAILED_ATTEMPTS) {
      throw new Error("Too many failed attempts. Your account has been temporarily locked for 1 hour.")
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { points: { increment: 1 } },
    })
  } else {
    await prisma.rateLimit.create({
      data: {
        key,
        points: 1,
        expiresAt: new Date(now.getTime() + LOCKOUT_DURATION_MS),
      },
    })
  }
}

export async function clearFailedLogins(prisma: PrismaClient, email: string) {
  const key = `failed-login:${email.toLowerCase()}`
  try {
    await prisma.rateLimit.delete({ where: { key } })
  } catch (e) {
    // Ignore if not found
  }
}

export async function isOAuthRateLimited(prisma: PrismaClient, email: string): Promise<boolean> {
  try {
    await checkRateLimit(prisma, `oauth-signin:${email.toLowerCase()}`, 10, 60 * 60 * 1000)
    return false
  } catch {
    return true
  }
}
