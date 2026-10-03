import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? (() => {
    throw new Error("JWT_SECRET is not configured");
})();

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

interface AuthenticatedUser {
    id: number;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Invalid authorization header",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (
            typeof decoded.id !== "number" ||
            typeof decoded.email !== "string" ||
            typeof decoded.role !== "string"
        ) {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}