import { renderBaseEmailLayout } from "./base-email-layout"

interface PasswordResetTemplateProps {
  userName?: string
  resetLink: string
}

export function renderPasswordResetTemplate({ userName, resetLink }: PasswordResetTemplateProps): string {
  const greeting = userName ? `Hi ${userName},` : "Hello,"

  const contentHtml = `
    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; tracking-tight: -0.5px;">
      Reset your password
    </h1>
    <p style="margin: 0 0 16px 0; color: #475569;">
      ${greeting} we received a request to reset your password for your <strong>Dev-Center</strong> account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);">
        Reset Password
      </a>
    </div>
    <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="margin: 8px 0 0 0; word-break: break-all; font-size: 13px;">
      <a href="${resetLink}" style="color: #0284c7; text-decoration: underline;">${resetLink}</a>
    </p>
    <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      If you did not request a password reset, you can safely ignore this email. Your account password will remain unchanged.
    </p>
  `

  return renderBaseEmailLayout({
    title: "Reset your Dev-Center Password",
    previewText: "Click here to set a new password for your account.",
    contentHtml,
  })
}
