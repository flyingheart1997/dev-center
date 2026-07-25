import type { PrismaClient } from "@/prisma/generated/client"

export async function cleanupVerificationTokens(prisma: PrismaClient) {
  return prisma.verificationToken.deleteMany({
    where: { expires: { lt: new Date() } },
  })
}

export async function cleanupRateLimits(prisma: PrismaClient) {
  return prisma.rateLimit.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
}

export async function cleanupEmployeeInvitations(prisma: PrismaClient) {
  return prisma.employeeInvitation.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
}

export async function cleanupExpiredSessions(prisma: PrismaClient) {
  return prisma.session.deleteMany({
    where: { expires: { lt: new Date() } },
  })
}

/**
 * Master cleanup service combining purges for all temporary auth data.
 * Can be run opportunistically or called on a background cron schedule.
 */
export async function cleanupAuthData(prisma: PrismaClient) {
  try {
    const [tokens, rateLimits, invites, sessions] = await Promise.all([
      cleanupVerificationTokens(prisma),
      cleanupRateLimits(prisma),
      cleanupEmployeeInvitations(prisma),
      cleanupExpiredSessions(prisma),
    ])
    return {
      tokensDeleted: tokens.count,
      rateLimitsDeleted: rateLimits.count,
      invitesDeleted: invites.count,
      sessionsDeleted: sessions.count,
    }
  } catch (err) {
    console.error("Failed to execute cleanupAuthData:", err)
    return null
  }
}
