import {
    pgTable,
    text,
    integer,
    timestamp,
    uuid,
    real,
    jsonb,
} from "drizzle-orm/pg-core";

export const guestUsage = pgTable("guest_usage", {
    guestId: text("guest_id").primaryKey(),
    successCount: integer("success_count").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});

export const ocrJob = pgTable("ocr_job", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    language: text("language").notNull(),
    extractedText: text("extracted_text").notNull(),
    confidence: real("confidence").notNull(),
    detectedLanguage: text("detected_language").notNull(),
    paragraphs: jsonb("paragraphs").$type<string[]>().notNull(),
});
