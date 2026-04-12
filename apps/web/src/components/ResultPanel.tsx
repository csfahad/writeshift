import { useState, useEffect, useRef, type ComponentType } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import UnderlineExtension from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Pencil,
    Eye,
    Type,
    AlertCircle,
    ZoomIn,
    ZoomOut,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Undo2,
    Redo2,
} from "lucide-react";
import type { Editor } from "@tiptap/react";
import type { ReactNode } from "react";

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
    errorCta?: ReactNode;
}

const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    unknown: "Unknown",
};

function textToHtml(text: string): string {
    if (!text) return "<p></p>";

    return text
        .split("\n\n")
        .map((para) => {
            const trimmed = para.trim();
            if (!trimmed) return "";

            // escape HTML entities and convert single newlines to <br>
            const escaped = trimmed
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>");
            return `<p>${escaped}</p>`;
        })
        .filter(Boolean)
        .join("");
}

interface ToolbarBtnProps {
    icon: ComponentType<{ className?: string }>;
    isActive?: boolean;
    disabled?: boolean;
    onClick: () => void;
    title: string;
}

function ToolbarBtn({
    icon: Icon,
    isActive = false,
    disabled = false,
    onClick,
    title,
}: ToolbarBtnProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-sm transition-colors ${isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

function ToolbarSep() {
    return <div className="w-px h-5 bg-border mx-1 shrink-0" />;
}

function EditorToolbar({ editor }: { editor: Editor }) {
    return (
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30">
            {/* Text format */}
            <ToolbarBtn
                icon={Bold}
                isActive={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl/⌘+B)"
            />
            <ToolbarBtn
                icon={Italic}
                isActive={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl/⌘+I)"
            />
            <ToolbarBtn
                icon={UnderlineIcon}
                isActive={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline (Ctrl/⌘+U)"
            />
            <ToolbarBtn
                icon={Strikethrough}
                isActive={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough (Ctrl/⌘+⇧+S)"
            />

            <ToolbarSep />

            {/* Alignment */}
            <ToolbarBtn
                icon={AlignLeft}
                isActive={editor.isActive({ textAlign: "left" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                }
                title="Align Left"
            />
            <ToolbarBtn
                icon={AlignCenter}
                isActive={editor.isActive({ textAlign: "center" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                }
                title="Align Center"
            />
            <ToolbarBtn
                icon={AlignRight}
                isActive={editor.isActive({ textAlign: "right" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                }
                title="Align Right"
            />
            <ToolbarBtn
                icon={AlignJustify}
                isActive={editor.isActive({ textAlign: "justify" })}
                onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                }
                title="Justify"
            />

            <ToolbarSep />

            {/* Headings */}
            <ToolbarBtn
                icon={Heading1}
                isActive={editor.isActive("heading", { level: 1 })}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                title="Heading 1"
            />
            <ToolbarBtn
                icon={Heading2}
                isActive={editor.isActive("heading", { level: 2 })}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                title="Heading 2"
            />

            <ToolbarSep />

            {/* Lists */}
            <ToolbarBtn
                icon={List}
                isActive={editor.isActive("bulletList")}
                onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
                title="Bullet List"
            />
            <ToolbarBtn
                icon={ListOrdered}
                isActive={editor.isActive("orderedList")}
                onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
                title="Numbered List"
            />

            <ToolbarSep />

            {/* History */}
            <ToolbarBtn
                icon={Undo2}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo (Ctrl+Z)"
            />
            <ToolbarBtn
                icon={Redo2}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo (Ctrl+Y)"
            />
        </div>
    );
}

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
    errorCta,
}: ResultPanelProps) {
    const [fontSize, setFontSize] = useState(16);
    const lastOcrTextRef = useRef("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            UnderlineExtension,
            Placeholder.configure({
                placeholder: "Extracted text will appear here…",
            }),
        ],
        content: textToHtml(editedText || text),
        editable: isEditing,
        onUpdate: ({ editor: e }) => {
            // sync plain text back to App for exports
            const plainText = e.getText({ blockSeparator: "\n\n" });
            onTextChange(plainText);
        },
    });

    useEffect(() => {
        if (editor && text && text !== lastOcrTextRef.current && !editor.isDestroyed) {
            lastOcrTextRef.current = text;
            const html = textToHtml(text);
            editor.commands.setContent(html);
        }
    }, [text, editor]);

    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            editor.setEditable(isEditing);
        }
    }, [isEditing, editor]);

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
                        {errorCta ? (
                            <div className="mt-4 flex justify-center w-full max-w-sm">
                                {errorCta}
                            </div>
                        ) : null}
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
                            Upload a handwritten image and click &quot;Extract
                            Text&quot;
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    // Stats
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
                            {languageNames[detectedLanguage] ||
                                detectedLanguage}
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
                        onClick={() =>
                            setFontSize((s) => Math.max(12, s - 2))
                        }
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
                        onClick={() =>
                            setFontSize((s) => Math.min(28, s + 2))
                        }
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

            {isEditing && editor && <EditorToolbar editor={editor} />}

            {/* Editor content */}
            <div
                className="p-6 min-h-[300px] max-h-[500px] overflow-auto custom-scrollbar"
                style={{ fontSize: `${fontSize}px` }}
            >
                <EditorContent editor={editor} />
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
