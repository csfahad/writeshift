import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, ClipboardPaste } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
    onFileSelect: (file: File) => void;
    file: File | null;
    onRemove: () => void;
}

export function ImageUpload({ onFileSelect, file, onRemove }: ImageUploadProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const f = acceptedFiles[0];
            if (f) onFileSelect(f);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
        onDropRejected: (rejections) => {
            const error = rejections[0]?.errors[0];
            if (error?.code === "file-too-large") {
                toast.error("File is too large. Maximum size is 10MB.");
            } else if (error?.code === "file-invalid-type") {
                toast.error("Invalid file type. Please upload JPEG, PNG, or WebP.");
            }
        },
    });

    const handlePaste = useCallback(async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith("image/")) {
                        const blob = await item.getType(type);
                        const pastedFile = new File(
                            [blob],
                            `pasted-image.${type.split("/")[1]}`,
                            { type }
                        );
                        onFileSelect(pastedFile);
                        toast.success("Image pasted from clipboard");
                        return;
                    }
                }
            }
            toast.error("No image found in clipboard");
        } catch {
            toast.error("Could not read from clipboard. Try using Ctrl+V instead.");
        }
    }, [onFileSelect]);

    if (file) {
        return (
            <Card className="p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-muted flex items-center justify-center border border-border shrink-0">
                            <FileImage className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                                {file.type.split("/")[1]?.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div
                {...getRootProps()}
                className={`
          relative p-10 flex flex-col items-center justify-center gap-4 cursor-pointer
          border-2 border-dashed transition-all duration-200
          ${isDragActive
                        ? "border-primary bg-primary/5 drop-active"
                        : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/20"
                    }
        `}
            >
                <input {...getInputProps()} />

                <div
                    className={`
            w-16 h-16 flex items-center justify-center bg-muted border-2 border-border
            transition-all duration-200
            ${isDragActive ? "scale-110 border-primary" : ""}
          `}
                >
                    <Upload
                        className={`w-7 h-7 transition-colors ${isDragActive ? "text-primary" : "text-muted-foreground"
                            }`}
                    />
                </div>

                <div className="text-center">
                    <p className="text-sm font-medium">
                        {isDragActive
                            ? "Drop your image here"
                            : "Drag & drop your handwritten image"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        JPEG, PNG, or WebP · Max 10MB
                    </p>
                </div>
            </div>

            <div className="px-4 py-2.5 border-t border-border bg-muted/10">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePaste();
                    }}
                >
                    <ClipboardPaste className="w-3.5 h-3.5 mr-2" />
                    Paste from clipboard
                </Button>
            </div>
        </Card>
    );
}
