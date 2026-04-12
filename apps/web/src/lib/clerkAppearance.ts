import { dark } from "@clerk/themes";

export function buildClerkAppearance(resolvedTheme: "light" | "dark") {
    const isDark = resolvedTheme === "dark";

    return {
        baseTheme: isDark ? dark : undefined,
        variables: {
            borderRadius: "0px",
            fontFamily: '"Space Grotesk", ui-sans-serif, sans-serif',
            fontFamilyButtons: '"Space Grotesk", ui-sans-serif, sans-serif',
            colorPrimary: isDark ? "#fdf851" : "#fcd34d",
            colorDanger: isDark ? "#f87171" : "#dc2626",
            colorSuccess: isDark ? "#86efac" : "#16a34a",
            colorWarning: isDark ? "#fcd34d" : "#ca8a04",
            colorText: isDark ? "#f5f5f5" : "#0a0a0a",
            colorTextSecondary: isDark ? "#a3a3a3" : "#525252",
            colorBackground: isDark ? "#252530" : "#ffffff",
            colorInputBackground: isDark ? "#2e2e38" : "#f5f5f5",
            colorInputText: isDark ? "#fafafa" : "#0a0a0a",
        },
        elements: {
            rootBox: "w-full flex justify-center",
            card: isDark
                ? "border-2 border-neutral-400 bg-[#252530] shadow-[4px_4px_0_0_#1a1a1a]"
                : "border-2 border-black bg-white shadow-[4px_4px_0_0_#1a1a1a]",
            headerTitle: "font-bold tracking-tight",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: isDark
                ? "border-2 border-neutral-500 bg-[#2e2e38] hover:bg-[#363644]"
                : "border-2 border-black bg-white hover:bg-neutral-50",
            formButtonPrimary: isDark
                ? "border-2 border-black bg-[#e8f066] text-black shadow-[3px_3px_0_0_#1a1a1a] hover:bg-[#f0f577]"
                : "border-2 border-black bg-[#d4e830] text-black shadow-[3px_3px_0_0_#1a1a1a] hover:bg-[#e0f040]",
            formButtonReset: isDark
                ? "border-2 border-neutral-500 text-neutral-100"
                : "border-2 border-black text-black",
            formFieldInput: isDark
                ? "border-2 border-neutral-500 bg-[#2e2e38] rounded-none"
                : "border-2 border-black bg-white rounded-none",
            formFieldLabel: "font-medium tracking-tight",
            footerActionLink:
                "font-semibold text-[#b8cf20] hover:text-[#d4e830]",
            identityPreviewText: "font-medium",
            formFieldSuccessText: "text-sm",
            formFieldErrorText: "text-sm",
            dividerLine: isDark ? "bg-neutral-600" : "bg-black",
            dividerText: "text-xs uppercase tracking-wider",
            userButtonPopoverCard: isDark
                ? "border-2 border-neutral-500"
                : "border-2 border-black",
        },
    };
}
