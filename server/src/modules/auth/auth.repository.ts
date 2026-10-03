import { prisma } from "../../db/prisma.js";

export const authRepository = {
    findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    },

    createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
    }) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
            },
        });
    },
};