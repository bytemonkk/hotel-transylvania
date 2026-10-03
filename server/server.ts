import express from "express";
import cors from "cors";
import roomRoutes from "./src/modules/rooms/room.routes.js";
import authRoutes from "./src/modules/auth/auth.routes.js";
import bookingRoutes from "./src/modules/booking/booking.routes.js";
import emailQueueRoutes from "./src/queues/email-queue.routes.js";
import { errorMiddleware } from "./src/middleware/error.middleware.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Hotel Transylvania server is alive 🦇",
    });
});

app.use("/api/rooms", roomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/email-queue", emailQueueRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});