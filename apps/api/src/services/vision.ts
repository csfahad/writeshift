const IMAGES_API_URL = "https://vision.googleapis.com/v1/images:annotate";
const FILES_API_URL = "https://vision.googleapis.com/v1/files:annotate";

const MAX_PAGES_PER_REQUEST = 5;

interface VisionResult {
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

// Image OCR
export async function detectText(
    base64Image: string,
    languageHints: string[] = [],
): Promise<VisionResult> {
    const apiKey = getApiKey();

    const requestBody = {
        requests: [
            {
                image: { content: base64Image },
                features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
                imageContext:
                    languageHints.length > 0 ? { languageHints } : undefined,
            },
        ],
    };

    const response = await fetch(`${IMAGES_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
            `Vision API error: ${(error as any).error?.message || response.statusText}`,
        );
    }

    const data = (await response.json()) as any;
    const annotations = data.responses?.[0];

    if (annotations?.error) {
        throw new Error(`Vision API error: ${annotations.error.message}`);
    }

    return parseFullTextAnnotation(annotations?.fullTextAnnotation);
}

// PDF OCR
export async function detectTextFromPdf(
    base64Pdf: string,
    totalPages: number,
    languageHints: string[] = [],
): Promise<VisionResult> {
    const apiKey = getApiKey();

    // build page batches of 5 (Vision API limit per request)
    const batches: number[][] = [];
    for (let i = 1; i <= totalPages; i += MAX_PAGES_PER_REQUEST) {
        const batch: number[] = [];
        for (
            let j = i;
            j <= Math.min(i + MAX_PAGES_PER_REQUEST - 1, totalPages);
            j++
        ) {
            batch.push(j);
        }
        batches.push(batch);
    }

    // process each batch sequentially
    const allTexts: string[] = [];
    const allParagraphs: string[] = [];
    let firstDetectedLanguage = "unknown";
    let totalConfidence = 0;
    let confidenceCount = 0;

    for (const batch of batches) {
        const requestBody = {
            requests: [
                {
                    inputConfig: {
                        content: base64Pdf,
                        mimeType: "application/pdf",
                    },
                    features: [
                        { type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 },
                    ],
                    imageContext:
                        languageHints.length > 0
                            ? { languageHints }
                            : undefined,
                    pages: batch,
                },
            ],
        };

        const response = await fetch(`${FILES_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
                `Vision API error: ${(error as any).error?.message || response.statusText}`,
            );
        }

        const data = (await response.json()) as any;
        const batchResponse = data.responses?.[0];

        if (batchResponse?.error) {
            throw new Error(`Vision API error: ${batchResponse.error.message}`);
        }

        const pageResponses = batchResponse?.responses || [];

        for (const pageRes of pageResponses) {
            const fullText = pageRes?.fullTextAnnotation;
            if (!fullText) continue;

            const parsed = parseFullTextAnnotation(fullText);

            if (parsed.text) {
                allTexts.push(parsed.text);
                allParagraphs.push(...parsed.paragraphs);
            }

            if (
                parsed.detectedLanguage !== "unknown" &&
                firstDetectedLanguage === "unknown"
            ) {
                firstDetectedLanguage = parsed.detectedLanguage;
            }
            if (parsed.confidence > 0) {
                totalConfidence += parsed.confidence;
                confidenceCount++;
            }
        }
    }

    return {
        text: allTexts.join("\n\n"),
        confidence:
            confidenceCount > 0
                ? Math.round(totalConfidence / confidenceCount)
                : 0,
        detectedLanguage: firstDetectedLanguage,
        paragraphs: allParagraphs,
    };
}

// Shared helpers
function getApiKey(): string {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_CLOUD_API_KEY is not configured");
    }
    return apiKey;
}

function parseFullTextAnnotation(fullTextAnnotation: any): VisionResult {
    if (!fullTextAnnotation) {
        return {
            text: "",
            confidence: 0,
            detectedLanguage: "unknown",
            paragraphs: [],
        };
    }

    const detectedLangs =
        fullTextAnnotation.pages?.[0]?.property?.detectedLanguages;
    const detectedLanguage = detectedLangs?.[0]?.languageCode || "unknown";
    const confidence = detectedLangs?.[0]?.confidence || 0;

    const paragraphs: string[] = [];
    for (const page of fullTextAnnotation.pages || []) {
        for (const block of (page as any).blocks || []) {
            for (const paragraph of block.paragraphs || []) {
                const paragraphText =
                    paragraph.words
                        ?.map(
                            (word: any) =>
                                word.symbols
                                    ?.map((s: any) => {
                                        const breakType =
                                            s.property?.detectedBreak?.type;
                                        let suffix = "";
                                        if (
                                            breakType === "SPACE" ||
                                            breakType === "SURE_SPACE"
                                        )
                                            suffix = " ";
                                        if (
                                            breakType === "EOL_SURE_SPACE" ||
                                            breakType === "LINE_BREAK"
                                        )
                                            suffix = "\n";
                                        return s.text + suffix;
                                    })
                                    .join("") || "",
                        )
                        .join("") || "";

                if (paragraphText.trim()) {
                    paragraphs.push(paragraphText.trim());
                }
            }
        }
    }

    return {
        text: fullTextAnnotation.text || "",
        confidence: Math.round(confidence * 100),
        detectedLanguage,
        paragraphs,
    };
}
