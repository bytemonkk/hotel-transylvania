import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";


import {
    createBooking,
    getBookingById,
} from "./booking.controller.js";

const router = Router();

router.post("/", requireAuth, createBooking);

router.get("/:id", requireAuth, getBookingById);

export default router;