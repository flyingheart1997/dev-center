export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must contain at least one uppercase, lowercase, number, and special character"

// Character pool must stay a subset of what PASSWORD_REGEX accepts — it previously included
// "^" (not allowed by the regex) and omitted "?" (which is allowed), so generated passwords
// could randomly fail their own validation.
const STRONG_PASSWORD_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&#"

export function generateStrongPassword(length = 16): string {
  let pass = "aZ1!" // guarantees one lowercase, one uppercase, one digit, one special char
  for (let i = pass.length; i < length; i++) {
    pass += STRONG_PASSWORD_CHARS.charAt(Math.floor(Math.random() * STRONG_PASSWORD_CHARS.length))
  }
  return pass
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("")
}
