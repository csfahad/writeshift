import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Copy,
    FileDown,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import { useExport } from "@/hooks/useExport";

interface ExportToolbarProps {
    text: string;
}

export function ExportToolbar({ text }: ExportToolbarProps) {
    const { copyToClipboard, exportAsPdf, exportAsJpg, exportingPdf, exportingJpg } =
        useExport();

    const handleCopy = () => {
        copyToClipboard(text);
    };

    const handlePdf = () => {
        const timestamp = new Date().toISOString().slice(0, 10);
        exportAsPdf(text, `writeshift-${timestamp}`);
    };

    const handleJpg = () => {
        const timestamp = new Date().toISOString().slice(0, 10);
        exportAsJpg(text, `writeshift-${timestamp}`);
    };

    return (
        <Card className="p-3">
            <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground mr-auto">
                    Export
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs"
                >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePdf}
                    disabled={exportingPdf}
                    className="h-8 text-xs"
                >
                    {exportingPdf ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                        <FileDown className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    PDF
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleJpg}
                    disabled={exportingJpg}
                    className="h-8 text-xs"
                >
                    {exportingJpg ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                        <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    JPG
                </Button>
            </div>
        </Card>
    );
}
