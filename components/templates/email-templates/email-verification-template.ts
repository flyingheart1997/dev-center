import { renderBaseEmailLayout } from "./base-email-layout"

interface EmailVerificationTemplateProps {
  userName?: string
  verifyLink: string
}

export function renderEmailVerificationTemplate({ userName, verifyLink }: EmailVerificationTemplateProps): string {
  const greeting = userName ? `Hi ${userName},` : "Hello,"

  const contentHtml = `
    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; tracking-tight: -0.5px;">
      Verify your email address
    </h1>
    <p style="margin: 0 0 16px 0; color: #475569;">
      ${greeting} welcome to <strong>Dev-Center</strong>! Please verify your email address to activate your account and start using the platform.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyLink}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);">
        Verify Email Address
      </a>
    </div>
    <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px;">
      Or copy and paste this verification link into your web browser:
    </p>
    <p style="margin: 8px 0 0 0; word-break: break-all; font-size: 13px;">
      <a href="${verifyLink}" style="color: #0284c7; text-decoration: underline;">${verifyLink}</a>
    </p>
    <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      If you did not create a Dev-Center account, you can safely ignore this email.
    </p>
  `

  return renderBaseEmailLayout({
    title: "Verify your Dev-Center Account Email",
    previewText: "Please verify your email address to complete your registration.",
    contentHtml,
  })
}
