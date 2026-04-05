const VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

interface VisionResult {
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

export async function detectText(
    base64Image: string,
    languageHints: string[] = [],
): Promise<VisionResult> {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
        throw new Error("GOOGLE_CLOUD_API_KEY is not configured");
    }

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

    const response = await fetch(`${VISION_API_URL}?key=${apiKey}`, {
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

    const fullTextAnnotation = annotations?.fullTextAnnotation;

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
