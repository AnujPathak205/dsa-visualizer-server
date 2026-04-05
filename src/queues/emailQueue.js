const { Queue } = require("bullmq");
const connection = require("../config/bullmq-connection");

const emailQueue = new Queue("email-queue", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = { emailQueue };