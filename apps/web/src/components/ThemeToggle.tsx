import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";

type Theme = "system" | "light" | "dark";

interface ThemeToggleProps {
    theme: Theme;
    onToggle: () => void;
}

const icons: Record<Theme, typeof Sun> = {
    system: Monitor,
    light: Sun,
    dark: Moon,
};



export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const Icon = icons[theme];

    const handleClick = () => {
        setIsAnimating(true);
        onToggle();
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-label={`Current: ${theme}. Switch theme.`}
            className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
            <Icon
                className={`size-4 transition-all duration-300 ease-in-out dark:text-background ${isAnimating ? "rotate-180 scale-110" : ""
                    }`}
            />
        </Button>
    );
}
