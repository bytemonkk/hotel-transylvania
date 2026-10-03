import { emailQueue } from "./email.queue.js";

export const emailQueueService = {
    async getQueueStats() {
        const [
            waiting,
            active,
            completed,
            failed,
            delayed,
        ] = await Promise.all([
            emailQueue.getWaitingCount(),
            emailQueue.getActiveCount(),
            emailQueue.getCompletedCount(),
            emailQueue.getFailedCount(),
            emailQueue.getDelayedCount(),
        ]);

        return {
            waiting,
            active,
            completed,
            failed,
            delayed,
        };
    },

    async getFailedJobs() {
        const jobs = await emailQueue.getFailed(
            0,
            49,
        );

        return jobs.map((job) => ({
            id: job.id,
            name: job.name,
            data: job.data,
            attemptsMade: job.attemptsMade,
            failedReason: job.failedReason,
            timestamp: job.timestamp,
        }));
    },

    async retryJob(jobId: string) {
        const job = await emailQueue.getJob(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        if (await job.isCompleted()) {
            throw new Error("JOB_ALREADY_COMPLETED");
        }

        await job.retry("failed");

        return {
            id: job.id,
            name: job.name,
            data: job.data,
        };
    },
};