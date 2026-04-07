import { useState, useEffect, useCallback } from "react";

type Theme = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "system";
        const stored = localStorage.getItem("writeshift-theme") as Theme | null;
        return stored || "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (typeof window === "undefined") return "dark";
        const stored = localStorage.getItem("writeshift-theme") as Theme | null;
        if (stored && stored !== "system") return stored;
        return getSystemTheme();
    });

    useEffect(() => {
        const root = document.documentElement;
        const resolved = theme === "system" ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        if (resolved === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("writeshift-theme", theme);
    }, [theme]);

    // listen for system theme changes when in "system" mode
    useEffect(() => {
        if (theme !== "system") return;

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            const resolved = e.matches ? "dark" : "light";
            setResolvedTheme(resolved);
            const root = document.documentElement;
            if (resolved === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => {
            if (prev === "system") {
                return getSystemTheme() === "dark" ? "light" : "dark";
            }
            if (prev === "dark") return "light";
            return "system";
        });
    }, []);

    return { theme, resolvedTheme, setTheme, toggleTheme };
}
