import { PrismaClient } from "@/prisma/generated/client"
import { VERIFY_EMAIL_PREFIX } from "./verify-identifier"

export async function generateAndSaveToken(
  prisma: PrismaClient,
  identifier: string,
  ttlMs: number,
  length?: number
) {
  let token = crypto.randomUUID()
  if (length) {
    token = token.replace(/-/g, "").slice(0, length).toUpperCase()
  }

  const expiresAt = new Date(Date.now() + ttlMs)

  let deleteWhere: { identifier: string } | { identifier: { startsWith: string; endsWith: string } } = { identifier }

  if (identifier.startsWith(`${VERIFY_EMAIL_PREFIX}:`)) {
    const parts = identifier.split(":")
    if (parts.length === 3) {
      const email = parts[2]
      deleteWhere = { identifier: { startsWith: `${VERIFY_EMAIL_PREFIX}:`, endsWith: `:${email}` } }
    }
  }

  // Opportunistic cleanup of expired tokens
  await prisma.verificationToken.deleteMany({
    where: { expires: { lt: new Date() } },
  }).catch(() => {})

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: deleteWhere }),
    prisma.verificationToken.create({
      data: { identifier, token, expires: expiresAt },
    }),
  ])

  return token
}
