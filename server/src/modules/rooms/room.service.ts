import { roomRepository } from "./room.repository.js";
import type { CreateRoomInput } from "../../validators/room.schema.js";

export const roomService = {
    getRooms() {
        return roomRepository.findAll();
    },

    getRoomById(id: number) {
        return roomRepository.findById(id);
    },

    createRoom(data: CreateRoomInput) {
        return roomRepository.create(data);
    },
};