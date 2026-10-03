import { Worker } from "bullmq";

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
    "email",
    async (job) => {
        console.log("📧 Email job received");

        console.log("Job ID:", job.id);
        console.log("Job data:", job.data);

        console.log("Email job processed");
    },
    {
        connection,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message
    );
});

console.log("Email worker started");