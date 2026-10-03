import { emailQueue } from "./email.queue.js";

export async function queueBookingConfirmation(data: {
    bookingId: number;
}) {
    await emailQueue.add(
        "booking-confirmation",
        {
            bookingId: data.bookingId,
        },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        }
    );
}