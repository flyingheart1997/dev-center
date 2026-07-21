export const PUBLIC_EMAIL_DOMAINS = new Set<string>([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.co.in",
  "ymail.com",
  "rocketmail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "aol.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "rediffmail.com",
  "inbox.com",
  "fastmail.com",
  "fastmail.fm",
])

export function isPublicEmailDomain(email?: string | null): boolean {
  if (!email || !email.includes("@")) return false
  const domain = email.trim().split("@")[1]?.toLowerCase()
  return !!domain && PUBLIC_EMAIL_DOMAINS.has(domain)
}
