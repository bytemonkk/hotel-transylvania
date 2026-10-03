import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import {
    getEmailQueueStats,
    getFailedEmailJobs,
    retryEmailJob,
} from "./email-queue.controller.js";

const router = Router();

router.get(
    "/stats",
    requireAuth,
    getEmailQueueStats,
);

router.get(
    "/failed",
    requireAuth,
    getFailedEmailJobs,
);

router.post(
    "/failed/:id/retry",
    requireAuth,
    retryEmailJob,
);

export default router;