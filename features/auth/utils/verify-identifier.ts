export const VERIFY_EMAIL_PREFIX = "verify-email"

export type VerifyIntent = "candidate" | "organization"

export function buildVerifyIdentifier(intent: VerifyIntent, email: string): string {
  return `${VERIFY_EMAIL_PREFIX}:${intent}:${email.toLowerCase()}`
}

export function parseVerifyIdentifier(identifier: string): { intent: VerifyIntent; email: string } | null {
  const parts = identifier.split(":")
  if (parts.length !== 3 || parts[0] !== VERIFY_EMAIL_PREFIX) return null
  const [, intent, email] = parts
  if (intent !== "candidate" && intent !== "organization") return null
  return { intent, email }
}
