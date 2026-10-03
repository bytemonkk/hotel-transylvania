import { Queue } from "bullmq";

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
};

export const emailQueue = new Queue("email", {
    connection,

    defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 5000,
        },

        // Keep the latest 100 successfully completed jobs
        removeOnComplete: 100,

        // Keep the latest 100 failed jobs
        // so they can be inspected/retried manually.
        removeOnFail: 100,
    },
});