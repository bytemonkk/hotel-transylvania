import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { AppError } from "../errors/app-error.js";

export function errorMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.error(
        `[${req.method}] ${req.originalUrl}`,
        error,
    );

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
        });
    }

    return res.status(500).json({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
    });
}