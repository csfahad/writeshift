import { useState, useCallback, useRef } from "react";
import { formatExtractedText } from "@/utils/formatText";

const API_URL = import.meta.env.VITE_API_URL!;

export type OcrErrorCode =
    | "GUEST_LIMIT"
    | "GUEST_ID_REQUIRED"
    | "UNAUTHORIZED"
    | null;

export interface OcrResult {
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

export interface UseOcrOptions {
    getToken?: () => Promise<string | null | undefined>;
    guestId?: string | null;
}

export function useOcr(options?: UseOcrOptions) {
    const { getToken, guestId } = options ?? {};
    const [result, setResult] = useState<OcrResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<OcrErrorCode>(null);
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
            setErrorCode(null);
            setResult(null);

            try {
                const headers: Record<string, string> = {};
                if (getToken) {
                    const token = await getToken();
                    if (token) {
                        headers.Authorization = `Bearer ${token}`;
                    }
                }
                if (!headers.Authorization && guestId) {
                    headers["X-Guest-Id"] = guestId;
                }

                const formData = new FormData();
                formData.append("image", file);
                formData.append("language", language);

                const response = await fetch(`${API_URL}/api/ocr`, {
                    method: "POST",
                    body: formData,
                    signal: controller.signal,
                    headers,
                });

                const data = (await response.json().catch(() => ({}))) as {
                    error?: string;
                    code?: string;
                    text?: string;
                    confidence?: number;
                    detectedLanguage?: string;
                    paragraphs?: string[];
                };

                if (!response.ok) {
                    const code = data.code as OcrErrorCode | undefined;
                    setErrorCode(code ?? null);
                    throw new Error(
                        data.error || `Server error (${response.status})`,
                    );
                }

                const finalResult: OcrResult = {
                    text: formatExtractedText(data.text as string) ?? "",
                    confidence: data.confidence ?? 0,
                    detectedLanguage: data.detectedLanguage ?? "unknown",
                    paragraphs: Array.isArray(data.paragraphs)
                        ? data.paragraphs
                        : [],
                };

                if (!finalResult.text || finalResult.text.trim().length === 0) {
                    throw new Error(
                        "No text detected. Try uploading a clearer image with visible handwriting.",
                    );
                }

                setResult(finalResult);
                return finalResult;
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError")
                    return null;

                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to process file. Please try again.";
                setError(message);
                return null;
            } finally {
                setIsLoading(false);
                abortRef.current = null;
            }
        },
        [getToken, guestId],
    );

    const reset = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        setResult(null);
        setError(null);
        setErrorCode(null);
        setIsLoading(false);
    }, []);

    const hydrateFromHistory = useCallback((payload: OcrResult) => {
        setError(null);
        setErrorCode(null);
        setResult(payload);
    }, []);

    return {
        processImage,
        result,
        isLoading,
        error,
        errorCode,
        reset,
        hydrateFromHistory,
    };
}
