import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProcessButtonProps {
    onClick: () => void;
    disabled: boolean;
    isLoading: boolean;
}

export function ProcessButton({
    onClick,
    disabled,
    isLoading,
}: ProcessButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full h-12 text-sm font-semibold tracking-wide transition-transform active:scale-[0.98]"
            size="lg"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Extracting text…
                </>
            ) : (
                <>
                    Extract Text
                    <span className="ml-3 hidden sm:flex items-center gap-1 opacity-80">
                        <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-primary-foreground/30 bg-primary-foreground/20 px-1 font-sans text-[12px] font-medium">
                            ⌘
                        </kbd>
                        <kbd className="inline-flex h-5 items-center justify-center rounded border border-primary-foreground/30 bg-primary-foreground/20 px-1.5 font-sans text-[10px] font-medium uppercase">
                            ↵
                        </kbd>
                    </span>
                </>
            )}
        </Button>
    );
}
