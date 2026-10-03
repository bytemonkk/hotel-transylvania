import express from "express";
import cors from "cors";
import { prisma } from "./src/db.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Hotel Transylvania server is alive 🦇"
    });
});

app.get("/api/rooms", async (req, res) => {
    try {
        const rooms = await prisma.room.findMany();

        res.json(rooms);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch rooms"
        });
    }
});

app.post("/api/rooms", async (req, res) => {
    try {
        const {
            roomNumber,
            name,
            description,
            capacity,
            pricePerNight
        } = req.body;

        const room = await prisma.room.create({
            data: {
                roomNumber,
                name,
                description,
                capacity,
                pricePerNight
            }
        });

        res.status(201).json(room);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create room"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});