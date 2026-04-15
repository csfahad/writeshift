import { eq, desc, sql, and } from "drizzle-orm";
import type { Database } from "../db";
import { ocrJob } from "../db/schema";

export interface VisionLikeResult {
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

export async function saveOcrJob(
    db: Database,
    userId: string,
    meta: {
        originalFilename: string;
        mimeType: string;
        language: string;
    },
    result: VisionLikeResult,
): Promise<string> {
    const inserted = await db
        .insert(ocrJob)
        .values({
            userId,
            originalFilename: meta.originalFilename,
            mimeType: meta.mimeType,
            language: meta.language,
            extractedText: result.text,
            confidence: result.confidence,
            detectedLanguage: result.detectedLanguage,
            paragraphs: result.paragraphs,
        })
        .returning({ id: ocrJob.id });

    return inserted[0]!.id;
}

const PREVIEW_LEN = 160;

interface OcrJobListRow {
    id: string;
    createdAt: Date;
    originalFilename: string;
    mimeType: string;
    language: string;
    confidence: number;
    detectedLanguage: string;
    preview: string;
}

export async function listOcrJobsForUser(db: Database, userId: string) {
    const rows = (await db
        .select({
            id: ocrJob.id,
            createdAt: ocrJob.createdAt,
            originalFilename: ocrJob.originalFilename,
            mimeType: ocrJob.mimeType,
            language: ocrJob.language,
            confidence: ocrJob.confidence,
            detectedLanguage: ocrJob.detectedLanguage,
            preview: sql<string>`CASE WHEN char_length(${ocrJob.extractedText}) > ${PREVIEW_LEN} THEN CONCAT(LEFT(${ocrJob.extractedText}, ${PREVIEW_LEN}), '…') ELSE ${ocrJob.extractedText} END`,
        })
        .from(ocrJob)
        .where(eq(ocrJob.userId, userId))
        .orderBy(desc(ocrJob.createdAt))
        .limit(100)) as OcrJobListRow[];

    return rows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        originalFilename: r.originalFilename,
        mimeType: r.mimeType,
        language: r.language,
        confidence: r.confidence,
        detectedLanguage: r.detectedLanguage,
        preview: r.preview,
    }));
}

export async function getOcrJobForUser(
    db: Database,
    userId: string,
    jobId: string,
) {
    const rows = await db
        .select()
        .from(ocrJob)
        .where(eq(ocrJob.id, jobId))
        .limit(1);

    const row = rows[0];
    if (!row || row.userId !== userId) {
        return null;
    }

    return {
        id: row.id,
        createdAt: row.createdAt.toISOString(),
        originalFilename: row.originalFilename,
        mimeType: row.mimeType,
        language: row.language,
        text: row.extractedText,
        confidence: row.confidence,
        detectedLanguage: row.detectedLanguage,
        paragraphs: row.paragraphs as string[],
    };
}

export async function deleteOcrJobForUser(
    db: Database,
    userId: string,
    jobId: string,
): Promise<boolean> {
    const deleted = await db
        .delete(ocrJob)
        .where(and(eq(ocrJob.id, jobId), eq(ocrJob.userId, userId)))
        .returning({ id: ocrJob.id });

    return deleted.length > 0;
}
