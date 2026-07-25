import { TRPCError } from "@trpc/server"
import { sendTransactionalEmail } from "@/lib/resend"
import { renderEmailVerificationTemplate } from "@/components/templates/email-templates/email-verification-template"
import { renderLoginOtpTemplate } from "@/components/templates/email-templates/login-otp-template"
import { renderPasswordResetTemplate } from "@/components/templates/email-templates/password-reset-template"
import { renderInviteEmailTemplate } from "@/components/templates/email-templates/invite-email-template"

export async function sendVerificationEmailService({
  email,
  userName,
  verifyLink,
  userId,
}: {
  email: string
  userName: string
  verifyLink: string
  userId: string
}) {
  console.log("==================================================")
  console.log(`🔑 DEV VERIFICATION LINK FOR [${email}]:`)
  console.log(verifyLink)
  console.log("==================================================")

  const html = renderEmailVerificationTemplate({ userName, verifyLink })
  const res = await sendTransactionalEmail({
    to: email,
    subject: "Verify your Dev-Center Account Email",
    html,
    idempotencyKey: `verify-email/${userId}-${Date.now()}`,
  })

  if (!res.success) {
    if (res.error?.includes("only send testing emails") || res.error?.includes("resend.com/domains")) {
      // Return sandbox fallback info instead of throwing
      return {
        isSandboxMode: true,
        message: "Resend Sandbox Mode: Email link printed in server console.",
      }
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to send email: ${res.error}`,
    })
  }

  return { isSandboxMode: false, message: "Verification email sent successfully." }
}

export async function sendLoginOtpEmailService({
  email,
  otpCode,
  userId,
}: {
  email: string
  otpCode: string
  userId: string
}) {
  console.log("==================================================")
  console.log(`🔑 DEV LOGIN OTP CODE FOR [${email}]: ${otpCode}`)
  console.log("==================================================")

  const html = renderLoginOtpTemplate({ otpCode })
  const res = await sendTransactionalEmail({
    to: email,
    subject: `${otpCode} is your Dev-Center Login Code`,
    html,
    idempotencyKey: `login-otp/${userId}-${Date.now()}`,
  })

  if (!res.success) {
    if (res.error?.includes("only send testing emails") || res.error?.includes("resend.com/domains")) {
      return {
        isSandboxMode: true,
        message: `OTP Code generated! (Resend Sandbox Mode: Code [${otpCode}] printed in server terminal).`,
      }
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to send email: ${res.error}`,
    })
  }

  return { isSandboxMode: false, message: "A 6-digit OTP code has been sent to your email." }
}

export async function sendPasswordResetEmailService({
  email,
  userName,
  resetLink,
  userId,
}: {
  email: string
  userName: string
  resetLink: string
  userId: string
}) {
  console.log("==================================================")
  console.log(`🔑 DEV PASSWORD RESET LINK FOR [${email}]:`)
  console.log(resetLink)
  console.log("==================================================")

  const html = renderPasswordResetTemplate({ userName, resetLink })
  const res = await sendTransactionalEmail({
    to: email,
    subject: "Reset your Dev-Center Password",
    html,
    idempotencyKey: `password-reset/${userId}-${Date.now()}`,
  })

  if (!res.success) {
    if (res.error?.includes("only send testing emails") || res.error?.includes("resend.com/domains")) {
      return {
        isSandboxMode: true,
        message: "Password reset link generated! (Resend Sandbox Mode: Link printed in server terminal).",
      }
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to send password reset email: ${res.error}`,
    })
  }

  return { isSandboxMode: false, message: "A password reset link has been sent to your email." }
}

export async function sendInviteEmailService({
  to,
  organizationName,
  role,
  inviterName,
  inviteLink,
  organizationId,
}: {
  to: string
  organizationName: string
  role: string
  inviterName: string
  inviteLink: string
  organizationId: string
}) {
  const html = renderInviteEmailTemplate({
    organizationName,
    role,
    inviterName,
    inviteLink,
  })

  const res = await sendTransactionalEmail({
    to,
    subject: `You've been invited to join ${organizationName} on Dev-Center`,
    html,
    idempotencyKey: `invite-employee/${organizationId}-${to}-${Date.now()}`,
  })

  if (!res.success) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Failed to send invite email: ${res.error}` })
  }

  return { success: true }
}
