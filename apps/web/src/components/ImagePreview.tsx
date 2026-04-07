import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface PreprocessSettings {
    brightness: number;
    contrast: number;
    grayscale: boolean;
}

interface ImagePreviewProps {
    src: string;
    settings: PreprocessSettings;
    onSettingsChange: (settings: PreprocessSettings) => void;
}

function sliderBackground(value: number, min: number, max: number): React.CSSProperties {
    const percent = ((value - min) / (max - min)) * 100;
    return {
        background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percent}%, var(--muted) ${percent}%, var(--muted) 100%)`,
    };
}

export function ImagePreview({
    src,
    settings,
    onSettingsChange,
}: ImagePreviewProps) {
    const filterString = [
        `brightness(${settings.brightness}%)`,
        `contrast(${settings.contrast}%)`,
        settings.grayscale ? "grayscale(100%)" : "",
    ]
        .filter(Boolean)
        .join(" ");

    const handleReset = () => {
        onSettingsChange({ brightness: 100, contrast: 100, grayscale: false });
    };

    const isModified =
        settings.brightness !== 100 ||
        settings.contrast !== 100 ||
        settings.grayscale;

    return (
        <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-medium">Preview & Enhance</h3>
                {isModified && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-xs h-7"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                    </Button>
                )}
            </div>

            <div className="relative bg-muted/20 p-2 max-h-56 overflow-auto custom-scrollbar">
                <img
                    src={src}
                    alt="Uploaded handwritten text"
                    className="w-full h-auto object-contain"
                    style={{ filter: filterString }}
                />
            </div>

            <div className="p-4 space-y-3">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Brightness</label>
                        <span className="text-xs font-mono text-muted-foreground tabular-nums">
                            {settings.brightness}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={50}
                        max={200}
                        step={5}
                        value={settings.brightness}
                        onChange={(e) =>
                            onSettingsChange({
                                ...settings,
                                brightness: Number(e.target.value),
                            })
                        }
                        className="range-slider"
                        style={sliderBackground(settings.brightness, 50, 200)}
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-muted-foreground">Contrast</label>
                        <span className="text-xs font-mono text-muted-foreground tabular-nums">
                            {settings.contrast}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min={50}
                        max={200}
                        step={5}
                        value={settings.contrast}
                        onChange={(e) =>
                            onSettingsChange({
                                ...settings,
                                contrast: Number(e.target.value),
                            })
                        }
                        className="range-slider"
                        style={sliderBackground(settings.contrast, 50, 200)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Grayscale</label>
                    <Button
                        variant={settings.grayscale ? "secondary" : "outline"}
                        size="sm"
                        className="h-7 text-xs min-w-[52px]"
                        onClick={() =>
                            onSettingsChange({
                                ...settings,
                                grayscale: !settings.grayscale,
                            })
                        }
                    >
                        {settings.grayscale ? "On" : "Off"}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
