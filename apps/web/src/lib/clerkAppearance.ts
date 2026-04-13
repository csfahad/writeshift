// Light-only Clerk appearance — dark theme branch removed.

export function buildClerkAppearance(_resolvedTheme?: string) {
    return {
        variables: {
            borderRadius: "0px",
            fontFamily: '"Space Grotesk", ui-sans-serif, sans-serif',
            fontFamilyButtons: '"Space Grotesk", ui-sans-serif, sans-serif',
            colorPrimary: "#fcd34d",
            colorDanger: "#dc2626",
            colorSuccess: "#16a34a",
            colorWarning: "#ca8a04",
            colorText: "#0a0a0a",
            colorTextSecondary: "#525252",
            colorBackground: "#ffffff",
            colorInputBackground: "#f5f5f5",
            colorInputText: "#0a0a0a",
        },
        elements: {
            rootBox: "w-full flex justify-center",
            card: "border-2 border-black bg-white shadow-[4px_4px_0_0_#1a1a1a]",
            headerTitle: "font-bold tracking-tight",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton:
                "border-2 border-black bg-white hover:bg-neutral-50",
            formButtonPrimary:
                "border-2 border-black bg-[#d4e830] text-black shadow-[3px_3px_0_0_#1a1a1a] hover:bg-[#e0f040]",
            formButtonReset: "border-2 border-black text-black",
            formFieldInput: "border-2 border-black bg-white rounded-none",
            formFieldLabel: "font-medium tracking-tight",
            footerActionLink:
                "font-semibold text-[#b8cf20] hover:text-[#d4e830]",
            identityPreviewText: "font-medium",
            formFieldSuccessText: "text-sm",
            formFieldErrorText: "text-sm",
            dividerLine: "bg-black",
            dividerText: "text-xs uppercase tracking-wider",
            userButtonPopoverCard: "border-2 border-black",
        },
    };
}
