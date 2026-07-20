interface BaseEmailProps {
  title: string
  previewText?: string
  contentHtml: string
}

export function renderBaseEmailLayout({ title, previewText = "Dev-Center Notification", contentHtml }: BaseEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preview Text -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left">
                    <div style="display: inline-flex; align-items: center; gap: 8px;">
                      <div style="width: 36px; height: 36px; border-radius: 10px; background-color: #0284c7; color: #ffffff; font-weight: 900; font-size: 20px; text-align: center; line-height: 36px; display: inline-block;">
                        D
                      </div>
                      <span style="font-size: 20px; font-weight: 800; tracking-tight: -0.5px; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; vertical-align: middle; margin-left: 8px;">
                        Dev-Center
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px; color: #334155; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 8px 0; font-weight: 500;">Dev-Center Multi-Tenant Recruitment & AI Assessment Platform</p>
              <p style="margin: 0; color: #cbd5e1;">© ${new Date().getFullYear()} Dev-Center Inc. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
