import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useTheme } from "@/hooks/useTheme";
import { buildClerkAppearance } from "@/lib/clerkAppearance";

export function SignInPage() {
    const { theme, resolvedTheme, toggleTheme } = useTheme();
    const baseAppearance = buildClerkAppearance(resolvedTheme);
    const signInAppearance = {
        ...baseAppearance,
        elements: {
            ...baseAppearance.elements,
            rootBox: "w-full flex justify-center",
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header
                theme={theme}
                resolvedTheme={resolvedTheme}
                onToggleTheme={toggleTheme}
            />
            <main className="flex-1 flex flex-col items-center px-4 py-10">
                <p className="text-sm text-muted-foreground mb-6">
                    <Link
                        to="/"
                        className="underline font-medium text-foreground"
                    >
                        ← Back home
                    </Link>
                </p>
                <div className="w-full max-w-md">
                    <SignIn
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        appearance={signInAppearance}
                    />
                </div>
            </main>
        </div>
    );
}
