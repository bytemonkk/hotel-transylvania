import type { Request, Response } from "express";
import { roomService } from "./room.service.js";
import { createRoomSchema } from "../../validators/room.schema.js";

export async function getRooms(req: Request, res: Response) {
    try {
        const rooms = await roomService.getRooms();

        res.json(rooms);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch rooms",
        });
    }
}

export async function createRoom(req: Request, res: Response) {
    try {
        const result = createRoomSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid room data",
                errors: result.error.flatten(),
            });
        }

        const room = await roomService.createRoom(result.data);

        return res.status(201).json(room);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to create room",
        });
    }
}

export async function getRoomById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "Invalid room ID",
            });
        }

        const room = await roomService.getRoomById(id);

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        res.json(room);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch room",
        });
    }
}