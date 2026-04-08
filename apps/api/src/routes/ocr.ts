import { Router } from "express";
import multer from "multer";
import { ocrLimiter } from "../middleware/rateLimiter";
import { detectText, detectTextFromPdf } from "../services/vision";
import { preprocessImage } from "../services/imagePreprocess";

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
                const result = await detectTextFromPdf(
                    base64Pdf,
                    totalPages,
                    languageHints,
                );

                res.json(result);
            } else {
                const skipPreprocess = req.body.skipPreprocess === "true";
                const imageBuffer = skipPreprocess
                    ? req.file.buffer
                    : await preprocessImage(req.file.buffer);

                const base64Image = imageBuffer.toString("base64");
                const result = await detectText(base64Image, languageHints);

                res.json(result);
            }
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
