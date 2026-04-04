import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await resend.emails.send({
    from: "Buoyant <noreply@buoyant.name.ng>",
    to: email,
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin:0;padding:0;background:#080808;font-family:monospace;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding:32px 40px;border-bottom:1px solid rgba(255,255,255,0.08);">
                      <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">
                        Buoyant<span style="color:#c8f533;">.</span>
                      </span>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">Password Reset</p>
                      <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 16px;letter-spacing:-0.5px;">Reset your password</h1>
                      <p style="color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6;margin:0 0 32px;">
                        We received a request to reset the password for your Buoyant account. Click the button below to choose a new password. This link expires in <strong style="color:rgba(255,255,255,0.6);">1 hour</strong>.
                      </p>
                      
                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                        <tr>
                          <td style="background:#c8f533;border-radius:50px;">
                            <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;color:#000000;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.05em;">
                              Reset Password →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color:rgba(255,255,255,0.2);font-size:12px;line-height:1.6;margin:0 0 8px;">
                        If you didn't request this, you can safely ignore this email. Your password won't change.
                      </p>
                      <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:0;">
                        Or copy this link: <span style="color:rgba(255,255,255,0.3);">${resetUrl}</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.08);">
                      <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:0;">
                        © ${new Date().getFullYear()} Buoyant. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  })
}
