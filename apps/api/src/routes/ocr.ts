import { Router } from "express";
import multer from "multer";
import { ocrLimiter } from "../middleware/rateLimiter";
import { optionalClerkAuth } from "../middleware/clerkAuth";
import { detectText, detectTextFromPdf } from "../services/vision";
import { preprocessImage } from "../services/imagePreprocess";
import { formatExtractedText } from "../utils/formatText";
import { getDb } from "../db";
import {
    getGuestSuccessCount,
    guestOcrLimit,
    incrementGuestSuccess,
} from "../services/guestUsage";
import { saveOcrJob } from "../services/ocrPersistence";
import { isValidGuestId } from "./guestStatus";

const MAX_PDF_PAGES = 20;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPEG, PNG, WEBP images and PDF files are allowed",
                ),
            );
        }
    },
});

export const ocrRouter = Router();

ocrRouter.post(
    "/",
    optionalClerkAuth,
    ocrLimiter,
    upload.single("image"),
    async (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file provided" });
                return;
            }

            const language = (req.body.language as string) || "auto";
            const languageHints = buildLanguageHints(language);
            const isPdf = req.file.mimetype === "application/pdf";

            let guestId: string | null = null;
            if (!req.auth?.userId) {
                const raw = req.headers["x-guest-id"];
                const id =
                    typeof raw === "string"
                        ? raw
                        : Array.isArray(raw)
                          ? raw[0]
                          : "";
                if (!id || !isValidGuestId(id)) {
                    res.status(400).json({
                        error: "Sign in or send a valid X-Guest-Id header (UUID) for free tries.",
                        code: "GUEST_ID_REQUIRED",
                    });
                    return;
                }
                guestId = id;
                const db = getDb();
                const used = await getGuestSuccessCount(db, guestId);
                if (used >= guestOcrLimit()) {
                    res.status(403).json({
                        error: "Free OCR limit reached. Sign in to continue.",
                        code: "GUEST_LIMIT",
                    });
                    return;
                }
            }

            let rawResult: Awaited<ReturnType<typeof detectText>>;

            if (isPdf) {
                const pdfBuffer = req.file.buffer;
                const totalPages = countPdfPages(pdfBuffer);

                if (totalPages > MAX_PDF_PAGES) {
                    res.status(400).json({
                        error: `PDF has ${totalPages} pages. Maximum allowed is ${MAX_PDF_PAGES} pages.`,
                    });
                    return;
                }

                if (totalPages === 0) {
                    res.status(400).json({
                        error: "Could not determine PDF page count. The file may be corrupted.",
                    });
                    return;
                }

                const base64Pdf = pdfBuffer.toString("base64");
                rawResult = await detectTextFromPdf(
                    base64Pdf,
                    totalPages,
                    languageHints,
                );
            } else {
                const skipPreprocess = req.body.skipPreprocess === "true";
                const imageBuffer = skipPreprocess
                    ? req.file.buffer
                    : await preprocessImage(req.file.buffer);

                const base64Image = imageBuffer.toString("base64");
                rawResult = await detectText(base64Image, languageHints);
            }

            const formattedText = formatExtractedText(rawResult.text);
            const result = {
                ...rawResult,
                text: formattedText,
            };

            const success = formattedText.trim().length > 0;

            if (success) {
                const db = getDb();
                if (req.auth?.userId) {
                    await saveOcrJob(
                        db,
                        req.auth.userId,
                        {
                            originalFilename: req.file.originalname || "upload",
                            mimeType: req.file.mimetype,
                            language,
                        },
                        result,
                    );
                } else if (guestId) {
                    await incrementGuestSuccess(db, guestId);
                }
            }

            res.json(result);
        } catch (error) {
            next(error);
        }
    },
);

function countPdfPages(buffer: Buffer): number {
    const content = buffer.toString("latin1");

    const pageMatches = content.match(/\/Type\s*\/Page(?!s)/g);
    if (pageMatches && pageMatches.length > 0) {
        return pageMatches.length;
    }

    const countMatch = content.match(/\/Count\s+(\d+)/);
    if (countMatch) {
        return parseInt(countMatch[1]!, 10);
    }

    return 1;
}

function buildLanguageHints(language: string): string[] {
    switch (language) {
        case "en":
            return ["en"];
        case "hi":
            return ["hi"];
        case "en+hi":
            return ["en", "hi"];
        case "auto":
        default:
            return [];
    }
}
