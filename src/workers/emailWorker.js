require("dotenv").config();

const { Worker } = require("bullmq");
const connection = require("../config/bullmq-connection");

// make sure this function is imported correctly
const { sendVerifyEmailOtp } = require("../services/sendMail/sendVerifyEmailOtp"); // adjust path if needed
const { sendWelcomeEmail } = require("../services/sendMail/sendWelComeEmail");

new Worker(
  "email-queue",
  async (job) => {
    if (job.name === "verify-email") {
      await sendVerifyEmailOtp(job.data);
    }else if(job.name === "welcome-email"){
      await sendWelcomeEmail(job.data);
    } else {
      console.warn("⚠️ Unknown job type:", job.name);
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

console.log("📨 Resume-Builder Email Worker running");