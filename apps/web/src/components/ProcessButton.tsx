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
                    <kbd className="ml-3 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 border border-primary-foreground/20">
                        ⌘↵
                    </kbd>
                </>
            )}
        </Button>
    );
}
