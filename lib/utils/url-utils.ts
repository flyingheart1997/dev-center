/**
 * Returns the base application URL dynamically.
 * Prioritizes NEXTAUTH_URL -> NEXT_PUBLIC_APP_URL -> VERCEL_URL -> localhost fallback.
 */
export function getAppUrl(): string {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return "http://localhost:3000"
}
