import { Card } from "@/components/ui/card";
import { Languages } from "lucide-react";

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

const languages = [
    { value: "auto", label: "Auto Detect" },
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी" },
    { value: "en+hi", label: "Both" },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">Language</h3>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
                {languages.map((lang) => (
                    <button
                        key={lang.value}
                        onClick={() => onChange(lang.value)}
                        className={`
              px-2 py-1.5 text-xs font-medium border-2 transition-all duration-150
              ${value === lang.value
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-background text-foreground border-border hover:border-primary/40 hover:bg-muted/30"
                            }
            `}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </Card>
    );
}
