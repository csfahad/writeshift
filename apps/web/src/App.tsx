import { useState, useCallback, useEffect } from "react";
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
import { useTheme } from "@/hooks/useTheme";

function App() {
    const { theme, resolvedTheme, toggleTheme } = useTheme();
    const { processImage, result, isLoading, error, reset } = useOcr();

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

    const handleFileSelect = useCallback(
        (selectedFile: File) => {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            reset();
            setEditedText("");
            setIsEditing(false);
        },
        [reset]
    );

    const handleRemoveFile = useCallback(() => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl(null);
        reset();
        setEditedText("");
        setIsEditing(false);
        setPreprocessSettings({ brightness: 100, contrast: 100, grayscale: false });
    }, [previewUrl, reset]);

    const handleProcess = useCallback(async () => {
        if (!file) return;
        const ocrResult = await processImage(file, language);
        if (ocrResult?.text) {
            setEditedText(ocrResult.text);
            toast.success("Text extracted successfully!", {
                description: `${ocrResult.text.split(/\s+/).length} words detected`,
            });
        }
    }, [file, language, processImage]);

    // handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                if (file && !isLoading) {
                    handleProcess();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [file, isLoading, handleProcess]);

    // handle paste event
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
                            { type: item.type }
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


    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h2 className="text-xl font-bold tracking-tight">
                        Convert Handwriting to Text
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Upload a handwritten image or PDF - get clean, editable, exportable
                        typed text. Supports English &amp; Hindi.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Panel — Upload & Controls */}
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

                        <LanguageSelector value={language} onChange={setLanguage} />

                        <ProcessButton
                            onClick={handleProcess}
                            disabled={!file}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Right Panel — Results */}
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
                            />
                        )}

                        {result && !isLoading && (
                            <ExportToolbar text={editedText || result.text} />
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-4 mt-auto no-print">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-between text-xs text-muted-foreground">
                    <span className="hidden md:inline">WriteShift · Handwriting to Text</span>
                    <span>
                        © {new Date().getFullYear()} WriteShift. All rights reserved.
                    </span>
                </div>
            </footer>

            <Toaster
                theme={resolvedTheme}
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

export default App;
