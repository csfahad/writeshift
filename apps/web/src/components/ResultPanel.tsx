import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Type, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";

interface ResultPanelProps {
    text: string;
    editedText: string;
    onTextChange: (text: string) => void;
    isEditing: boolean;
    onToggleEdit: () => void;
    detectedLanguage?: string;
    confidence?: number;
    error: string | null;
    hasResult: boolean;
}

const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    unknown: "Unknown",
};

export function ResultPanel({
    text,
    editedText,
    onTextChange,
    isEditing,
    onToggleEdit,
    detectedLanguage,
    confidence,
    error,
    hasResult,
}: ResultPanelProps) {

    const [fontSize, setFontSize] = useState(16);

    if (error) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
                    <div className="w-12 h-12 bg-destructive/10 flex items-center justify-center border-2 border-destructive/30">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-destructive">
                            Processing Error
                        </p>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">
                            {error}
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    if (!hasResult) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center gap-3 text-center py-20">
                    <div className="w-14 h-14 bg-muted flex items-center justify-center border-2 border-border">
                        <Type className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            Extracted text will appear here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Upload a handwritten image and click &quot;Extract Text&quot;
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    const displayText = editedText || text;
    const wordCount = displayText.trim().split(/\s+/).filter(Boolean).length;
    const charCount = displayText.length;

    return (
        <Card className="overflow-hidden" id="result-panel">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">Result</h3>
                    {detectedLanguage && detectedLanguage !== "unknown" && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-secondary text-secondary-foreground border border-border">
                            {languageNames[detectedLanguage] || detectedLanguage}
                        </span>
                    )}
                    {confidence !== undefined && confidence > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
                            {confidence}%
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {/* Font size controls */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                        title="Decrease font size"
                    >
                        <ZoomOut className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-[10px] font-mono text-muted-foreground w-8 text-center tabular-nums">
                        {fontSize}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                        title="Increase font size"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </Button>

                    <div className="w-px h-5 bg-border mx-1" />

                    {/* Edit toggle */}
                    <Button
                        variant={isEditing ? "secondary" : "outline"}
                        size="sm"
                        onClick={onToggleEdit}
                        className="h-7 text-xs"
                    >
                        {isEditing ? (
                            <>
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                            </>
                        ) : (
                            <>
                                <Pencil className="w-3 h-3 mr-1" />
                                Edit
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 min-h-[300px] max-h-[500px] overflow-auto custom-scrollbar">
                {isEditing ? (
                    <textarea
                        value={editedText}
                        onChange={(e) => onTextChange(e.target.value)}
                        className="w-full min-h-[280px] bg-transparent border-none outline-none resize-none result-text text-foreground"
                        style={{ fontSize: `${fontSize}px` }}
                        placeholder="Edit the extracted text here..."
                        spellCheck={false}
                    />
                ) : (
                    <div
                        className="result-text text-foreground"
                        style={{ fontSize: `${fontSize}px` }}
                        id="result-text-content"
                    >
                        {displayText}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
                {isEditing && (
                    <span className="ml-auto text-primary">Editing mode</span>
                )}
            </div>
        </Card>
    );
}
