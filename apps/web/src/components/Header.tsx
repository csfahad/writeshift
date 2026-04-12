import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText, LayoutDashboard } from "lucide-react";
import { buildClerkAppearance } from "@/lib/clerkAppearance";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    theme: "system" | "light" | "dark";
    resolvedTheme: "light" | "dark";
    onToggleTheme: () => void;
}

export function Header({ theme, resolvedTheme, onToggleTheme }: HeaderProps) {
    const navigate = useNavigate();
    const clerkAppearance = buildClerkAppearance(resolvedTheme);

    return (
        <header className="border-b border-border bg-primary backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 min-w-0">
                    <Link
                        to="/"
                        className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity"
                    >
                        <div className="w-9 h-9 bg-primary flex items-center justify-center border-2 border-border shadow-sm">
                            <FileText className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="hidden sm:block min-w-0">
                            <h1 className="text-lg font-bold tracking-tight leading-tight dark:text-primary-foreground">
                                WriteShift
                            </h1>
                            <p className="text-[10px] text-muted-foreground leading-tight dark:text-muted">
                                Handwriting → Typed Text
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <SignedIn>
                        <UserButton appearance={clerkAppearance}>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label="Launch workspace"
                                    labelIcon={
                                        <LayoutDashboard className="h-3 w-3 font-bold" />
                                    }
                                    onClick={() => navigate("/app")}
                                />
                                <UserButton.Action label="manageAccount" />
                                <UserButton.Action label="signOut" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                    <SignedOut>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-2 border-border bg-background px-3 text-foreground shadow-sm dark:border-border! dark:bg-background! dark:text-foreground!"
                            asChild
                        >
                            <Link to="/sign-in">Sign in</Link>
                        </Button>
                    </SignedOut>
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                </div>
            </div>
        </header>
    );
}
