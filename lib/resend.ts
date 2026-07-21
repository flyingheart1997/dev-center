import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build")

interface SendTransactionalEmailProps {
  to: string | string[]
  subject: string
  html: string
  idempotencyKey?: string
}

export async function sendTransactionalEmail({ to, subject, html, idempotencyKey }: SendTransactionalEmailProps) {
  try {
    const from = process.env.RESEND_FROM_EMAIL || "Dev-Center <onboarding@resend.dev>"

    const options = {
      from,
      to,
      subject,
      html,
    }

    const { data, error } = await resend.emails.send(
      options,
      idempotencyKey ? { idempotencyKey } : undefined
    )

    if (error) {
      console.error("❌ Resend Email Error:", error.message)
      return { success: false, error: error.message }
    }

    return { success: true, messageId: data?.id }
  } catch (err: any) {
    console.error("❌ sendTransactionalEmail Unexpected Error:", err)
    return { success: false, error: err.message || "Failed to send email" }
  }
}
