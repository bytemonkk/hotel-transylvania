import { emailQueue } from "./email.queue.js";

export async function queueBookingConfirmation(data: {
    bookingId: number;
}) {
    await emailQueue.add(
        "booking-confirmation",
        {
            bookingId: data.bookingId,
        },
    );
}