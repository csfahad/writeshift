import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText } from "lucide-react";

interface HeaderProps {
    theme: "system" | "light" | "dark";
    onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
    return (
        <header className="border-b border-border bg-primary backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary flex items-center justify-center border-2 border-border shadow-sm">
                        <FileText className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight leading-tight dark:text-primary-foreground">
                            WriteShift
                        </h1>
                        <p className="text-[10px] text-muted-foreground leading-tight dark:text-muted">
                            Handwriting → Typed Text
                        </p>
                    </div>
                </div>

                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
        </header>
    );
}
