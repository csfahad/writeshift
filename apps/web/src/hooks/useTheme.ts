export function useTheme() {
    return {
        theme: "light" as const,
        resolvedTheme: "light" as const,
        setTheme: (_t: string) => {},
        toggleTheme: () => {},
    };
}
