import type { Request, Response } from "express";
import { getDb } from "../db";
import { getGuestSuccessCount, guestOcrLimit } from "../services/guestUsage";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidGuestId(value: string): boolean {
    return UUID_RE.test(value);
}

export async function guestStatusHandler(req: Request, res: Response) {
    if (req.auth?.userId) {
        res.json({
            mode: "authenticated" as const,
            limit: null,
            used: null,
            remaining: null,
        });
        return;
    }

    const guestId = req.headers["x-guest-id"];
    const id =
        typeof guestId === "string"
            ? guestId
            : Array.isArray(guestId)
              ? guestId[0]
              : "";

    if (!id || !isValidGuestId(id)) {
        res.status(400).json({
            error: "Valid X-Guest-Id header (UUID) is required.",
            code: "GUEST_ID_REQUIRED",
        });
        return;
    }

    try {
        const db = getDb();
        const used = await getGuestSuccessCount(db, id);
        const limit = guestOcrLimit();
        res.json({
            mode: "guest" as const,
            limit,
            used,
            remaining: Math.max(0, limit - used),
        });
    } catch (e) {
        console.error("[guest-status]", e);
        res.status(503).json({
            error: "Database unavailable.",
            code: "DB_ERROR",
        });
    }
}
