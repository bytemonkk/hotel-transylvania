import bcrypt from "bcryptjs";

import { authRepository } from "./auth.repository.js";

import type {
    RegisterInput,
    LoginInput,
} from "../../validators/auth.schema.js";

export const authService = {
    async register(data: RegisterInput) {
        const existingUser = await authRepository.findUserByEmail(
            data.email
        );

        if (existingUser) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        const passwordHash = await bcrypt.hash(data.password, 12);

        const user = await authRepository.createUser({
            name: data.name,
            email: data.email,
            passwordHash,
        });

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    },

    async login(data: LoginInput) {
        const user = await authRepository.findUserByEmail(
            data.email
        );

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const passwordValid = await bcrypt.compare(
            data.password,
            user.passwordHash
        );

        if (!passwordValid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    },
};