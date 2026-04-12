CREATE TABLE "guest_usage" (
	"guest_id" text PRIMARY KEY NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE "ocr_job" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"language" text NOT NULL,
	"extracted_text" text NOT NULL,
	"confidence" real NOT NULL,
	"detected_language" text NOT NULL,
	"paragraphs" jsonb NOT NULL
);
