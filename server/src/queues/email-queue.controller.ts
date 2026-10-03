import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { emailQueueService } from "./email-queue.service.js";

export async function getEmailQueueStats(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        const stats =
            await emailQueueService.getQueueStats();

        return res.json({
            queue: "email",
            stats,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch email queue statistics",
        });
    }
}

export async function getFailedEmailJobs(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        const jobs =
            await emailQueueService.getFailedJobs();

        return res.json({
            queue: "email",
            jobs,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch failed email jobs",
        });
    }
}

export async function retryEmailJob(
    req: AuthenticatedRequest,
    res: Response,
) {
    try {
        const jobId = String(req.params.id);

        const job =
            await emailQueueService.retryJob(jobId);

        return res.json({
            message: "Email job queued for retry",
            job,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            if (error.message === "JOB_NOT_FOUND") {
                return res.status(404).json({
                    message: "Email job not found",
                });
            }

            if (error.message === "JOB_ALREADY_COMPLETED") {
                return res.status(409).json({
                    message: "Email job already completed",
                });
            }
        }

        return res.status(500).json({
            message: "Failed to retry email job",
        });
    }
}