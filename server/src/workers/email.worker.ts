import { Worker } from "bullmq";
import { prisma } from "../db/prisma.js";

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
        }

        console.log("Email job processed");
    },
    {
        connection,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message
    );
});

console.log("Email worker started");