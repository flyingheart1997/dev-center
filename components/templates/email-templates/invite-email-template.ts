import { renderBaseEmailLayout } from "./base-email-layout"

interface InviteEmailTemplateProps {
  organizationName: string
  role: string
  inviterName: string
  inviteLink: string
}

export function renderInviteEmailTemplate({
  organizationName,
  role,
  inviterName,
  inviteLink,
}: InviteEmailTemplateProps): string {
  const contentHtml = `
    <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px 0; tracking-tight: -0.5px;">
      You're invited to join ${organizationName}
    </h1>
    <p style="margin: 0 0 16px 0; color: #475569;">
      ${inviterName} has invited you to join <strong>${organizationName}</strong> on Dev-Center as a <strong>${role.replace(/_/g, " ")}</strong>.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${inviteLink}" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);">
        Accept Invitation
      </a>
    </div>
    <p style="margin: 24px 0 0 0; color: #64748b; font-size: 13px;">
      Or copy and paste this link into your web browser:
    </p>
    <p style="margin: 8px 0 0 0; word-break: break-all; font-size: 13px;">
      <a href="${inviteLink}" style="color: #0284c7; text-decoration: underline;">${inviteLink}</a>
    </p>
    <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      This invitation expires in 30 days. If you weren't expecting this, you can safely ignore this email.
    </p>
  `

  return renderBaseEmailLayout({
    title: `You're invited to join ${organizationName}`,
    previewText: `${inviterName} invited you to join ${organizationName} on Dev-Center.`,
    contentHtml,
  })
}
