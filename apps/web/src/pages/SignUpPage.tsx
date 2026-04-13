import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { buildClerkAppearance } from "@/lib/clerkAppearance";

export function SignUpPage() {
    const baseAppearance = buildClerkAppearance();
    const signUpAppearance = {
        ...baseAppearance,
        elements: {
            ...baseAppearance.elements,
            rootBox: "w-full flex justify-center",
        },
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />
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
                    <SignUp
                        routing="path"
                        path="/sign-up"
                        signInUrl="/sign-in"
                        appearance={signUpAppearance}
                    />
                </div>
            </main>
        </div>
    );
}
