import { Router } from "express";
import { generatePdf } from "../services/pdfGenerator";

export const exportRouter = Router();

exportRouter.post("/pdf", async (req, res, next) => {
    try {
        const { text, fontSize = 14, title = "WriteShift Export" } = req.body;

        if (!text || typeof text !== "string") {
            res.status(400).json({ error: "Text content is required" });
            return;
        }

        if (text.length > 100_000) {
            res.status(400).json({
                error: "Text is too long. Maximum 100,000 characters.",
            });
            return;
        }

        const pdfBuffer = await generatePdf(text, { fontSize, title });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(title)}.pdf"`,
        );
        res.send(Buffer.from(pdfBuffer));
    } catch (error) {
        next(error);
    }
});
