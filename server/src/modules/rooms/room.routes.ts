import { Router } from "express";
import {
    getRooms,
    getRoomById,
    createRoom,
} from "./room.controller.js";

const router = Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
router.post("/", createRoom);

export default router;