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
