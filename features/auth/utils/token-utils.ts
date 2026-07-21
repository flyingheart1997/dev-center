import { PrismaClient } from "@/prisma/generated/client"

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

  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: { identifier, token, expires: expiresAt },
    }),
  ])

  return token
}
