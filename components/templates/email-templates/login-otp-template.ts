import { renderBaseEmailLayout } from "./base-email-layout"

interface LoginOtpTemplateProps {
  otpCode: string
}

export function renderLoginOtpTemplate({ otpCode }: LoginOtpTemplateProps): string {
  const contentHtml = `
    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; tracking-tight: -0.5px;">
      Your Login Code
    </h1>
    <p style="margin: 0 0 20px 0; color: #475569;">
      Use the 6-digit verification code below to log into your <strong>Dev-Center</strong> account. This code expires in <strong>10 minutes</strong>.
    </p>
    <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px border-slate-200;">
      <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">
        ${otpCode}
      </span>
    </div>
    <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 13px;">
      If you did not request this login code, please secure your account immediately or ignore this message.
    </p>
  `

  return renderBaseEmailLayout({
    title: `${otpCode} is your Dev-Center Login Code`,
    previewText: `Use login code ${otpCode} to sign into your account.`,
    contentHtml,
  })
}
