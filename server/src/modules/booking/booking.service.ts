import { bookingRepository } from "./booking.repository.js";

import { queueBookingConfirmation } from "../../queues/booking-email.queue.js";

export const bookingService = {
    async createBooking(data: {
        userId: number;
        roomId: number;
        checkIn: Date;
        checkOut: Date;
        guests: number;
    }) {
        if (data.checkIn >= data.checkOut) {
            throw new Error("INVALID_DATES");
        }

        if (data.guests <= 0) {
            throw new Error("INVALID_GUEST_COUNT");
        }

        const room = await bookingRepository.findRoomById(
            data.roomId,
        );

        if (!room) {
            throw new Error("ROOM_NOT_FOUND");
        }

        if (room.status !== "AVAILABLE") {
            throw new Error("ROOM_NOT_AVAILABLE");
        }

        if (data.guests > room.capacity) {
            throw new Error("ROOM_CAPACITY_EXCEEDED");
        }

        const overlappingBooking =
            await bookingRepository.findOverlappingBooking(
                data.roomId,
                data.checkIn,
                data.checkOut,
            );

        if (overlappingBooking) {
            throw new Error("ROOM_ALREADY_BOOKED");
        }

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (data.checkOut.getTime() -
                data.checkIn.getTime()) /
                millisecondsPerDay,
        );

        const totalAmount =
            nights * Number(room.pricePerNight);

        const booking =
            await bookingRepository.createBooking({
                userId: data.userId,
                roomId: data.roomId,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
                totalAmount,
            });

        await queueBookingConfirmation({
            bookingId: booking.id,
        });

        return booking;
    },

    async updateBookingStatus(
        bookingId: number,
        newStatus: "CONFIRMED" | "CANCELLED",
        userId: number,
        userRole: string,
    ) {
        const booking =
            await bookingRepository.findBookingById(
                bookingId,
            );

        if (!booking) {
            throw new Error("BOOKING_NOT_FOUND");
        }

        const isOwnerOrAdmin =
            userRole === "OWNER" ||
            userRole === "ADMIN";

        const isBookingOwner =
            booking.userId === userId;

        /*
         * The authenticated user must either:
         * 1. Own the booking, or
         * 2. Be an OWNER/ADMIN.
         */
        if (!isOwnerOrAdmin && !isBookingOwner) {
            throw new Error("FORBIDDEN");
        }

        /*
         * Only OWNER/ADMIN can confirm a booking.
         *
         * PENDING -> CONFIRMED
         */
        if (newStatus === "CONFIRMED") {
            if (!isOwnerOrAdmin) {
                throw new Error("FORBIDDEN");
            }

            if (booking.status !== "PENDING") {
                throw new Error(
                    "INVALID_STATUS_TRANSITION",
                );
            }
        }

        /*
         * PENDING -> CANCELLED
         * CONFIRMED -> CANCELLED
         */
        if (newStatus === "CANCELLED") {
            if (
                booking.status !== "PENDING" &&
                booking.status !== "CONFIRMED"
            ) {
                throw new Error(
                    "INVALID_STATUS_TRANSITION",
                );
            }
        }

        return bookingRepository.updateBookingStatus(
            bookingId,
            newStatus,
        );
    },

    async getBookingById(id: number) {
        return bookingRepository.findBookingById(id);
    },

    async getBookingByIdForUser(
        bookingId: number,
        userId: number,
    ) {
        return bookingRepository.findBookingByIdAndUserId(
            bookingId,
            userId,
        );
    },
};