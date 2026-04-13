import { type ReactNode } from "react";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { buildClerkAppearance } from "@/lib/clerkAppearance";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
const appearance = buildClerkAppearance();

export function AppProviders({ children }: { children: ReactNode }) {
    if (!publishableKey) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
                <div className="max-w-md border-2 border-border p-6 shadow-md space-y-2 text-center">
                    <h1 className="text-lg font-bold tracking-tight">
                        Missing Clerk configuration
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Set{" "}
                        <code className="font-mono text-xs bg-muted px-1 py-0.5 border border-border">
                            VITE_CLERK_PUBLISHABLE_KEY
                        </code>{" "}
                        in{" "}
                        <code className="font-mono text-xs">apps/web/.env</code>{" "}
                        and restart the dev server.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ClerkProvider
            publishableKey={publishableKey}
            appearance={appearance}
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            signInForceRedirectUrl="/app"
            signUpForceRedirectUrl="/app"
            afterSignOutUrl="/"
        >
            <BrowserRouter>{children}</BrowserRouter>
        </ClerkProvider>
    );
}
