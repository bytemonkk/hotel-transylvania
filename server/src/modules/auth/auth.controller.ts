import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../../validators/auth.schema.js";
import { authService } from "./auth.service.js";

export async function register(req: Request, res: Response) {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid registration data",
                errors: result.error.flatten(),
            });
        }

        const user = await authService.register(result.data);

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "EMAIL_ALREADY_EXISTS"
        ) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to register user",
        });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid login data",
                errors: result.error.flatten(),
            });
        }

        const user = await authService.login(result.data);

        return res.status(200).json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "INVALID_CREDENTIALS"
        ) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Failed to login",
        });
    }
}