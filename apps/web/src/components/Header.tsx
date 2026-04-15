import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FileText, LayoutDashboard } from "lucide-react";
import { buildClerkAppearance } from "@/lib/clerkAppearance";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const clerkAppearance = buildClerkAppearance();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="border-b-2 border-t-2 md:border-t-0 border-border bg-primary sticky top-0 z-50">
            <div className="max-w-full mx-auto flex items-stretch h-14">
                <Link
                    to="/"
                    className="flex items-center gap-2.5 px-5 sm:border-r sm:border-border shrink-0 hover:bg-primary/80 transition-colors"
                >
                    <div className="w-8 h-8 bg-primary flex items-center justify-center border-2 border-border shadow-sm">
                        <FileText className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:flex sm:items-center min-w-0">
                        <span className="text-xl font-bold tracking-tight leading-none">
                            WriteShift
                        </span>
                    </div>
                </Link>

                <div className="flex-1" />

                <SignedIn>
                    <Link
                        to="/app"
                        className="flex items-center px-5 border-l-2 border-border bg-secondary text-secondary-foreground text-sm font-semibold tracking-tight transition-colors hover:bg-secondary/90"
                    >
                        Launch Workspace
                    </Link>
                    <div className="flex items-center px-4 border-l border-border">
                        <UserButton appearance={clerkAppearance}>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label="Launch workspace"
                                    labelIcon={
                                        <LayoutDashboard className="h-3 w-3" />
                                    }
                                    onClick={() => navigate("/app")}
                                />
                                <UserButton.Action
                                    label="History"
                                    labelIcon={<FileText className="h-3 w-3" />}
                                    onClick={() => navigate("/history")}
                                />
                                <UserButton.Action label="manageAccount" />
                                <UserButton.Action label="signOut" />
                            </UserButton.MenuItems>
                        </UserButton>
                    </div>
                </SignedIn>

                <SignedOut>
                    <Link
                        to="/sign-in"
                        className={`flex items-center px-5 border-l border-border text-sm font-medium tracking-tight transition-colors hover:bg-accent/60 ${isActive("/sign-in") ? "bg-accent/40" : ""
                            }`}
                    >
                        Sign in
                    </Link>

                    <Link
                        to="/app"
                        className="flex items-center px-5 border-l-2 border-border bg-secondary text-secondary-foreground text-sm font-semibold tracking-tight transition-colors hover:bg-secondary/90"
                    >
                        Start free
                    </Link>
                </SignedOut>
            </div>
        </header>
    );
}
