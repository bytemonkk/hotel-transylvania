import { prisma } from "../../db/prisma.js";
import type { CreateRoomInput } from "../../validators/room.schema.js";

export const roomRepository = {
    findAll() {
        return prisma.room.findMany();
    },

    findById(id: number) {
        return prisma.room.findUnique({
            where: {
                id,
            },
        });
    },

    create(data: CreateRoomInput) {
        return prisma.room.create({
            data: {
                roomNumber: data.roomNumber,
                name: data.name,
                description: data.description ?? null,
                capacity: data.capacity,
                pricePerNight: data.pricePerNight,
            },
        });
    },
};