import axios from "axios"

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_URL = "https://api.brevo.com/v3/smtp/email"

const APP_NAME = "ShopMaster"

export async function sendVerifyEmailOtp({ email, username, otp, otpExpiry }) {
  try {
    const expiryMinutes = Math.max(
      1,
      Math.floor((new Date(otpExpiry).getTime() - Date.now()) / 60000)
    )

    const payload = {
      sender: {
        name: `${APP_NAME} Security`,
        email: process.env.EMAIL, // must be domain-based
      },
      to: [{ email, name: username || "User" }],
      subject: `Email Verification Code – ${APP_NAME}`,

      // ✅ Minimal HTML (Security Style)
      htmlContent: `
<div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
  <p>Hello ${username || "User"},</p>

  <p>
    Use the verification code below to complete your email verification.
  </p>

  <p style="font-size:24px; font-weight:bold; letter-spacing:4px;">
    ${otp}
  </p>

  <p>
    This code will expire in ${expiryMinutes} minute(s). <br/>
    Generated On: ${new Date().toUTCString()}
  </p>

  <p>
    If you did not request this verification, you may ignore this email.
  </p>

  <hr/>

  <p style="font-size:12px; color:#555;">
    This is an automated security message.
    Please do not reply to this email.
  </p>
</div>
      `,

      // ✅ Plain Text Version (Very Important)
      textContent: `
Hello ${username || "User"},

Your email verification code is:

${otp}

This code will expire in ${expiryMinutes} minute(s).
Generated On: ${new Date().toUTCString()}

If you did not request this verification, you may ignore this email.

This is an automated security message.
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(`${APP_NAME} VERIFY EMAIL OTP SENT:`, response.data.messageId)
    return response.data
  } catch (error) {
    console.error(`${APP_NAME} Verify email OTP failed:`, error.response?.data || error.message)
    throw error
  }
}
