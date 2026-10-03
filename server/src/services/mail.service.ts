import nodemailer from "nodemailer";

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD;

if (!mailUser || !mailPassword) {
    throw new Error("MAIL_USER and MAIL_PASSWORD must be configured");
}

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT || 465),
    secure: true,
    auth: {
        user: mailUser,
        pass: mailPassword,
    },
});

export async function sendBookingConfirmationEmail(data: {
    to: string;
    customerName: string;
    bookingId: number;
    roomName: string;
    roomNumber: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    totalAmount: string;
}) {
    await transporter.sendMail({
        from:
            process.env.MAIL_FROM ||
            `"Hotel Transylvania" <${mailUser}>`,
        to: data.to,
        subject: `Booking Confirmation #${data.bookingId} - Hotel Transylvania`,
        text: `
Hello ${data.customerName},

Your Hotel Transylvania booking has been confirmed.

Booking ID: ${data.bookingId}
Room: ${data.roomName} (${data.roomNumber})
Check-in: ${data.checkIn.toISOString().split("T")[0]}
Check-out: ${data.checkOut.toISOString().split("T")[0]}
Guests: ${data.guests}
Total Amount: ₹${data.totalAmount}

Thank you for choosing Hotel Transylvania!
        `.trim(),
    });
}