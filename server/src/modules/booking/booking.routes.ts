import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createBooking,
  getBookingById,
  updateBookingStatus,
} from "./booking.controller.js";

const router = Router();

router.post("/", requireAuth, createBooking);

router.get("/:id", requireAuth, getBookingById);

router.patch("/:id/status", requireAuth, updateBookingStatus);

export default router;
