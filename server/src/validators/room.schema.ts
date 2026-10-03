import { z } from "zod";

export const createRoomSchema = z.object({
    roomNumber: z.string().min(1, "Room number is required"),

    name: z.string().min(1, "Room name is required"),

    description: z.string().optional(),

    capacity: z.number().int().positive("Capacity must be greater than 0"),

    pricePerNight: z.number().positive("Price must be greater than 0"),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;