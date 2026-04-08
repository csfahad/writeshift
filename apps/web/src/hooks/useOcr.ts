import { useState, useCallback, useRef } from "react";
import { formatExtractedText } from "@/utils/formatText";

interface OcrResult {
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

export function useOcr() {
    const [result, setResult] = useState<OcrResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const processImage = useCallback(
        async (file: File, language: string): Promise<OcrResult | null> => {
            if (abortRef.current) {
                abortRef.current.abort();
            }

            const controller = new AbortController();
            abortRef.current = controller;

            setIsLoading(true);
            setError(null);
            setResult(null);

            try {
                const formData = new FormData();
                formData.append("image", file);
                formData.append("language", language);

                const response = await fetch("/api/ocr", {
                    method: "POST",
                    body: formData,
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(
                        (data as any).error ||
                            `Server error (${response.status})`
                    );
                }

                const data = (await response.json()) as OcrResult;

                const finalResult: OcrResult = {
                    ...data,
                    text: formatExtractedText(data.text),
                };

                if (
                    !finalResult.text ||
                    finalResult.text.trim().length === 0
                ) {
                    throw new Error(
                        "No text detected. Try uploading a clearer image with visible handwriting."
                    );
                }

                setResult(finalResult);
                return finalResult;
            } catch (err: any) {
                if (err.name === "AbortError") return null;

                const message =
                    err.message ||
                    "Failed to process file. Please try again.";
                setError(message);
                return null;
            } finally {
                setIsLoading(false);
                abortRef.current = null;
            }
        },
        []
    );

    const reset = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        setResult(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return { processImage, result, isLoading, error, reset };
}
