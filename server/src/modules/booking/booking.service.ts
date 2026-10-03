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

        const room = await bookingRepository.findRoomById(data.roomId);

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

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (data.checkOut.getTime() - data.checkIn.getTime()) /
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