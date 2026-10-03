import { Worker } from "bullmq";

import { prisma } from "../db/prisma.js";
import { sendBookingConfirmationEmail } from "../services/mail.service.js";

const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
    "email",
    async (job) => {
        console.log("📧 Email job received");
        console.log("Job ID:", job.id);
        console.log("Job name:", job.name);
        console.log("Job data:", job.data);

        if (job.name === "booking-confirmation") {
            const booking = await prisma.booking.findUnique({
                where: {
                    id: job.data.bookingId,
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

            if (!booking) {
                throw new Error("BOOKING_NOT_FOUND");
            }

            console.log("Booking found");
            console.log("Customer:", booking.user.name);
            console.log("Email:", booking.user.email);
            console.log("Room:", booking.room.name);
            console.log("Check-in:", booking.checkIn);
            console.log("Check-out:", booking.checkOut);
            console.log("Guests:", booking.guests);
            console.log("Total:", booking.totalAmount);

            await sendBookingConfirmationEmail({
                to: booking.user.email,
                customerName: booking.user.name,
                bookingId: booking.id,
                roomName: booking.room.name,
                roomNumber: booking.room.roomNumber,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut,
                guests: booking.guests,
                totalAmount: booking.totalAmount.toString(),
            });

            console.log("📨 Booking confirmation email sent");
        }

        console.log("Email job processed");
    },
    {
        connection,
    },
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message,
    );
});

async function gracefulShutdown(signal: string) {
    console.log(`\n${signal} received`);
    console.log("Stopping email worker...");

    try {
        await worker.close();

        console.log("Email worker closed");

        await prisma.$disconnect();

        console.log("Prisma connection closed");

        process.exit(0);
    } catch (error) {
        console.error(
            "Error during graceful shutdown:",
            error,
        );

        process.exit(1);
    }
}

process.on("SIGINT", () => {
    void gracefulShutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void gracefulShutdown("SIGTERM");
});

console.log("Email worker started");