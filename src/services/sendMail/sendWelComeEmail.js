import axios from "axios"

const BREVO_URL = "https://api.brevo.com/v3/smtp/email"
const BREVO_API_KEY = process.env.BREVO_API_KEY

const APP_NAME = "ShopMaster"
const FRONTEND_URL = "https://dsa-visualizer-client.vercel.app/"

export async function sendWelcomeEmail({ email, name, role }) {
  try {
    const isSeller = role === "seller"

    const subject = isSeller
      ? `Seller Account Activated – ${APP_NAME}`
      : `Account Activated – ${APP_NAME}`

    const dashboardLink = isSeller
      ? SELLER_DASHBOARD_URL
      : FRONTEND_URL

    const accountTypeText = isSeller
      ? "Your seller account has been successfully activated."
      : "Your account has been successfully activated."

    const payload = {
      sender: {
        name: APP_NAME,
        email: process.env.EMAIL, // must be domain-based
      },
      to: [{ email, name: name || "User" }],
      subject,

      // ✅ Minimal Transactional HTML
      htmlContent: `
<div style="font-family: Arial, sans-serif; font-size:14px; color:#000; line-height:1.6;">
  <p>Hello ${name || "User"},</p>

  <p>
    ${accountTypeText}
  </p>

  <p>
    Activated On: ${new Date().toUTCString()}
  </p>

  <p>
    You can access your account here:
  </p>

  <p>
    ${dashboardLink}
  </p>

  <hr/>

  <p style="font-size:12px; color:#555;">
    This is an automated account notification from ${APP_NAME}.
    Please do not reply to this email.
  </p>
</div>
      `,

      // ✅ Plain Text Version (Important for Deliverability)
      textContent: `
Hello ${name || "User"},

${accountTypeText}

Activated On: ${new Date().toUTCString()}

Access your account:
${dashboardLink}

This is an automated account notification.
      `,
    }

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    })

    console.log(
      `${APP_NAME} ACCOUNT ACTIVATION EMAIL SENT (${role}):`,
      response.data.messageId
    )

    return response.data
  } catch (error) {
    console.error(
      `${APP_NAME} Welcome email failed:`,
      error.response?.data || error.message
    )
    throw error
  }
}