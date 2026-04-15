import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProcessButton } from "@/components/ProcessButton";
import { ResultPanel } from "@/components/ResultPanel";
import { ExportToolbar } from "@/components/ExportToolbar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useOcr } from "@/hooks/useOcr";
import { useGuestId } from "@/hooks/useGuestId";
import { useGuestOcrStatus } from "@/hooks/useGuestOcrStatus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function WorkspacePage() {
    const { isSignedIn, getToken } = useAuth();
    const guestId = useGuestId();
    const [searchParams, setSearchParams] = useSearchParams();
    const [postSuccessTick, setPostSuccessTick] = useState(0);

    const getTokenForApi = useCallback(() => getToken(), [getToken]);

    const {
        processImage,
        result,
        isLoading,
        error,
        errorCode,
        reset,
        hydrateFromHistory,
    } = useOcr(
        useMemo(
            () => ({
                getToken: getTokenForApi,
                guestId: isSignedIn ? null : guestId,
            }),
            [getTokenForApi, isSignedIn, guestId],
        ),
    );

    const { status: guestStatus } = useGuestOcrStatus(
        guestId,
        !!isSignedIn,
        postSuccessTick,
    );

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [language, setLanguage] = useState("auto");
    const [editedText, setEditedText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [preprocessSettings, setPreprocessSettings] = useState({
        brightness: 100,
        contrast: 100,
        grayscale: false,
    });

    const guestBlocked =
        !isSignedIn && guestStatus !== null && guestStatus.remaining <= 0;

    const loadingHistoryIdRef = useRef<string | null>(null);

    const handleFileSelect = useCallback(
        (selectedFile: File) => {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            reset();
            setEditedText("");
            setIsEditing(false);
        },
        [reset],
    );

    const handleRemoveFile = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        reset();
        setEditedText("");
        setIsEditing(false);
        setPreprocessSettings({
            brightness: 100,
            contrast: 100,
            grayscale: false,
        });
    }, [previewUrl, reset]);

    const handleProcess = useCallback(async () => {
        if (!file || guestBlocked) return;
        const ocrResult = await processImage(file, language);
        if (ocrResult?.text) {
            setEditedText(ocrResult.text);
            setPostSuccessTick((t) => t + 1);
            toast.success("Text extracted successfully!", {
                description: `${ocrResult.text.split(/\s+/).length} words detected`,
            });
        }
    }, [file, language, processImage, guestBlocked]);

    useEffect(() => {
        const historyId = searchParams.get("historyId");
        if (
            historyId &&
            isSignedIn &&
            loadingHistoryIdRef.current !== historyId
        ) {
            loadingHistoryIdRef.current = historyId;
            const loadJob = async () => {
                try {
                    const token = await getTokenForApi();
                    if (!token) return;
                    const API_URL = import.meta.env.VITE_API_URL;
                    const res = await fetch(
                        `${API_URL}/api/ocr/jobs/${historyId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        },
                    );
                    const data = await res.json();
                    if (res.ok && data) {
                        hydrateFromHistory({
                            text: data.text,
                            confidence: data.confidence,
                            detectedLanguage: data.detectedLanguage,
                            paragraphs: data.paragraphs,
                        });
                        setEditedText(data.text);
                        setIsEditing(false);
                        toast.success("Loaded saved scan", {
                            description: data.originalFilename,
                        });
                    } else {
                        toast.error(data.error || "Could not open scan");
                    }
                } catch {
                    toast.error("Could not open scan");
                } finally {
                    // remove param from URL
                    setSearchParams({}, { replace: true });
                }
            };
            void loadJob();
        }
    }, [
        searchParams,
        setSearchParams,
        isSignedIn,
        getTokenForApi,
        hydrateFromHistory,
    ]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                if (file && !isLoading && !guestBlocked) {
                    void handleProcess();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [file, isLoading, guestBlocked, handleProcess]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    e.preventDefault();
                    const blob = item.getAsFile();
                    if (blob) {
                        const pastedFile = new File(
                            [blob],
                            `pasted-image.${item.type.split("/")[1]}`,
                            { type: item.type },
                        );
                        handleFileSelect(pastedFile);
                        toast.success("Image pasted from clipboard");
                    }
                    break;
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handleFileSelect]);

    const guestLimitCta =
        errorCode === "GUEST_LIMIT" ? (
            <Button asChild className="border-2 border-border shadow-sm">
                <Link to="/sign-in">Sign in to continue</Link>
            </Button>
        ) : null;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight">
                        Convert Handwriting to Text
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload a handwritten image or PDF - get clean, editable,
                        exportable typed text. Supports English &amp; Hindi.
                    </p>
                </div>

                {!isSignedIn && guestStatus ? (
                    <Card className="mb-6 border-2 border-border shadow-sm">
                        <CardContent className="py-3 px-4 flex flex-wrap items-center gap-2 text-sm">
                            <Badge
                                variant="secondary"
                                className="border border-border"
                            >
                                Guest mode
                            </Badge>
                            <span>
                                {guestStatus.remaining > 0 ? (
                                    <>
                                        <strong>{guestStatus.remaining}</strong>{" "}
                                        free{" "}
                                        {guestStatus.remaining === 1
                                            ? "scan"
                                            : "scans"}{" "}
                                        left - then sign in to keep going.
                                    </>
                                ) : (
                                    <>
                                        Free scans used -{" "}
                                        <Link
                                            to="/sign-in"
                                            className="font-semibold underline text-foreground"
                                        >
                                            sign in
                                        </Link>{" "}
                                        for unlimited OCR and saved history.
                                    </>
                                )}
                            </span>
                        </CardContent>
                    </Card>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <ImageUpload
                            onFileSelect={handleFileSelect}
                            file={file}
                            onRemove={handleRemoveFile}
                        />

                        {previewUrl && file && !file.type.includes("pdf") && (
                            <ImagePreview
                                src={previewUrl}
                                settings={preprocessSettings}
                                onSettingsChange={setPreprocessSettings}
                            />
                        )}

                        <LanguageSelector
                            value={language}
                            onChange={setLanguage}
                        />

                        <ProcessButton
                            onClick={() => void handleProcess()}
                            disabled={!file || guestBlocked}
                            isLoading={isLoading}
                        />

                        {guestBlocked ? (
                            <p className="text-xs text-muted-foreground">
                                <Link
                                    to="/sign-in"
                                    className="font-medium underline text-foreground"
                                >
                                    Sign in
                                </Link>{" "}
                                to run more OCR and keep your scans.
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : (
                            <ResultPanel
                                text={result?.text || ""}
                                editedText={editedText}
                                onTextChange={setEditedText}
                                isEditing={isEditing}
                                onToggleEdit={() => setIsEditing(!isEditing)}
                                detectedLanguage={result?.detectedLanguage}
                                confidence={result?.confidence}
                                error={error}
                                hasResult={!!result}
                                errorCta={guestLimitCta}
                            />
                        )}

                        {result && !isLoading && (
                            <ExportToolbar text={editedText || result.text} />
                        )}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border py-4 mt-auto no-print">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-between text-xs text-muted-foreground">
                    <span className="hidden md:inline">
                        WriteShift · Handwriting to Text
                    </span>
                    <span>
                        © {new Date().getFullYear()} WriteShift. All rights
                        reserved.
                    </span>
                </div>
            </footer>

            <Toaster
                theme="light"
                position="bottom-right"
                toastOptions={{
                    style: {
                        borderRadius: "0px",
                        border: "2px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                    },
                }}
            />
        </div>
    );
}
