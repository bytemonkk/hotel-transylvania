import express from "express";
import cors from "cors";
import roomRoutes from "./src/modules/rooms/room.routes.js";

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});