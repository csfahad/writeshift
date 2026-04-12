import { verifyToken } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";

export async function optionalClerkAuth(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    const secret = process.env.CLERK_SECRET_KEY;
    const auth = req.headers.authorization;
    if (!secret || !auth?.startsWith("Bearer ")) {
        next();
        return;
    }
    const token = auth.slice(7);
    try {
        const payload = await verifyToken(token, { secretKey: secret });
        const sub = payload.sub;
        if (sub) {
            req.auth = { userId: sub };
        }
    } catch {}
    next();
}

export async function requireClerkAuth(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const secret = process.env.CLERK_SECRET_KEY;
    const auth = req.headers.authorization;
    if (!secret) {
        res.status(503).json({
            error: "Authentication is not configured on the server.",
            code: "AUTH_NOT_CONFIGURED",
        });
        return;
    }
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Sign in required.",
            code: "UNAUTHORIZED",
        });
        return;
    }
    try {
        const payload = await verifyToken(auth.slice(7), { secretKey: secret });
        const sub = payload.sub;
        if (!sub) {
            res.status(401).json({
                error: "Invalid token.",
                code: "UNAUTHORIZED",
            });
            return;
        }
        req.auth = { userId: sub };
        next();
    } catch {
        res.status(401).json({ error: "Invalid token.", code: "UNAUTHORIZED" });
    }
}
