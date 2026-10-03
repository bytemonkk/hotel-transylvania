import type { Request, Response } from "express";
import { bookingService } from "./booking.service.js";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

export async function createBooking(
    req: AuthenticatedRequest,
    res: Response
) {
    try {
        const {
            roomId,
            checkIn,
            checkOut,
            guests,
        } = req.body;

        // User must be authenticated
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        // Validate booking input
        if (
            !roomId ||
            !checkIn ||
            !checkOut ||
            !guests
        ) {
            return res.status(400).json({
                message: "Missing required booking fields",
            });
        }

        // userId comes from the authenticated JWT,
        // NOT from the client request body.
        const booking = await bookingService.createBooking({
            userId: req.user.id,
            roomId: Number(roomId),
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: Number(guests),
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            switch (error.message) {
                case "INVALID_DATES":
                    return res.status(400).json({
                        message: "Check-out must be after check-in",
                    });

                case "INVALID_GUEST_COUNT":
                    return res.status(400).json({
                        message: "Guest count must be greater than zero",
                    });

                case "ROOM_NOT_FOUND":
                    return res.status(404).json({
                        message: "Room not found",
                    });

                case "ROOM_NOT_AVAILABLE":
                    return res.status(400).json({
                        message: "Room is not available",
                    });

                case "ROOM_CAPACITY_EXCEEDED":
                    return res.status(400).json({
                        message: "Number of guests exceeds room capacity",
                    });

                case "ROOM_ALREADY_BOOKED":
                    return res.status(409).json({
                        message: "Room is already booked for these dates",
                    });
            }
        }

        return res.status(500).json({
            message: "Failed to create booking",
        });
    }
}

export async function getBookingById(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid booking ID",
            });
        }

        const booking = await bookingService.getBookingById(id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
            });
        }

        return res.json(booking);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to fetch booking",
        });
    }
}