import { eq } from "drizzle-orm";
import type { Database } from "../db";
import { guestUsage } from "../db/schema";

const GUEST_OCR_LIMIT = 3;

export function guestOcrLimit(): number {
    return GUEST_OCR_LIMIT;
}

export async function getGuestSuccessCount(
    db: Database,
    guestId: string,
): Promise<number> {
    const rows = await db
        .select({ successCount: guestUsage.successCount })
        .from(guestUsage)
        .where(eq(guestUsage.guestId, guestId))
        .limit(1);
    return rows[0]?.successCount ?? 0;
}

export async function incrementGuestSuccess(
    db: Database,
    guestId: string,
): Promise<void> {
    const existing = await db
        .select()
        .from(guestUsage)
        .where(eq(guestUsage.guestId, guestId))
        .limit(1);

    if (existing.length === 0) {
        await db.insert(guestUsage).values({
            guestId,
            successCount: 1,
        });
    } else {
        await db
            .update(guestUsage)
            .set({
                successCount: existing[0]!.successCount + 1,
                updatedAt: new Date(),
            })
            .where(eq(guestUsage.guestId, guestId));
    }
}
