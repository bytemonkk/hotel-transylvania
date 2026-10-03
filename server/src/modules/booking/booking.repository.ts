import { prisma } from "../../db/prisma.js";

export const bookingRepository = {
    async findRoomById(roomId: number) {
        return prisma.room.findUnique({
            where: {
                id: roomId,
            },
        });
    },

    async findOverlappingBooking(
        roomId: number,
        checkIn: Date,
        checkOut: Date,
    ) {
        return prisma.booking.findFirst({
            where: {
                roomId,
                status: {
                    in: ["PENDING", "CONFIRMED"],
                },
                checkIn: {
                    lt: checkOut,
                },
                checkOut: {
                    gt: checkIn,
                },
            },
        });
    },

    async createBooking(data: {
        userId: number;
        roomId: number;
        checkIn: Date;
        checkOut: Date;
        guests: number;
        totalAmount: number;
    }) {
        return prisma.booking.create({
            data: {
                userId: data.userId,
                roomId: data.roomId,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                guests: data.guests,
                totalAmount: data.totalAmount,
            },
        });
    },

    // General booking lookup
    async findBookingById(id: number) {
        return prisma.booking.findUnique({
            where: {
                id,
            },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },

    // Ownership-aware booking lookup
    async findBookingByIdAndUserId(
        id: number,
        userId: number,
    ) {
        return prisma.booking.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                room: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    },

    // Update booking status
    async updateBookingStatus(
        bookingId: number,
        status: "PENDING" | "CONFIRMED" | "CANCELLED",
    ) {
        return prisma.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status,
            },
        });
    },
};