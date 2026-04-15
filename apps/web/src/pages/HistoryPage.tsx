import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import {
    Calendar,
    FileText,
    ArrowRight,
    Loader2,
    MousePointerClick,
    Trash2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export interface OcrJobSummary {
    id: string;
    createdAt: string;
    originalFilename: string;
    mimeType: string;
    language: string;
    confidence: number;
    detectedLanguage: string;
    preview: string;
}

const API_URL = import.meta.env.VITE_API_URL!;

const truncateFilename = (filename: string, maxLength = 35) => {
    if (!filename || filename.length <= maxLength) return filename;
    const charsToShow = maxLength - 3;
    const frontChars = Math.ceil(charsToShow * 0.6);
    const backChars = Math.floor(charsToShow * 0.4);
    return (
        filename.substring(0, frontChars) +
        "..." +
        filename.substring(filename.length - backChars)
    );
};

export function HistoryPage() {
    const { isSignedIn, getToken, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<OcrJobSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadList = useCallback(async () => {
        if (!isSignedIn) {
            setJobs([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                setError("Could not get session token.");
                setJobs([]);
                return;
            }
            const res = await fetch(`${API_URL}/api/ocr/jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = (await res.json()) as {
                jobs?: OcrJobSummary[];
                error?: string;
            };
            if (!res.ok) {
                setError(data.error || "Failed to load history");
                setJobs([]);
                return;
            }
            setJobs(data.jobs ?? []);
        } catch {
            setError("Failed to load history");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, getToken]);

    useEffect(() => {
        if (isLoaded) {
            void loadList();
        }
    }, [isLoaded, loadList]);

    const handleOpenJob = (id: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (deletingId === id) return;
        navigate(`/app?historyId=${id}`);
    };

    const handleDeleteJob = async (id: string) => {
        setDeletingId(id);
        try {
            const token = await getToken();
            if (!token) {
                toast.error("Could not authenticate");
                return;
            }
            const res = await fetch(`${API_URL}/api/ocr/jobs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Failed to delete from history");
                return;
            }

            toast.success("Scan deleted successfully");
            setJobs((prev) => prev.filter((job) => job.id !== id));
        } catch {
            toast.error("An error occurred while deleting");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            <Header />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 relative z-10 flex flex-col">
                <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-3">
                            Workspace History
                        </h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            Review, edit, and export your previous OCR scans.
                            Your processed documents are saved here securely.
                        </p>
                    </div>
                    {isSignedIn && (
                        <Button
                            variant="outline"
                            className="shrink-0 border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                            asChild
                        >
                            <Link to="/app">
                                New Scan <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    )}
                </div>

                {!isLoaded || loading ? (
                    <div className="flex-1 border-2 border-dashed border-border flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p className="font-medium tracking-tight">
                                Loading your OCR history...
                            </p>
                        </div>
                    </div>
                ) : !isSignedIn ? (
                    <div className="flex-1 border-2 border-border shadow-sm flex items-center justify-center min-h-[400px] bg-card/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center max-w-md text-center p-8">
                            <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center border-2 border-border rotate-3">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">
                                Sign in to view history
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Create an account or sign in to save your OCR
                                scans and access them from anywhere.
                            </p>
                            <Button
                                className="border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold tracking-tight"
                                asChild
                            >
                                <Link to="/sign-in">Sign In</Link>
                            </Button>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-1 border-2 border-destructive/50 bg-destructive/10 flex items-center justify-center min-h-[400px]">
                        <div className="text-center p-8">
                            <h2 className="text-xl font-bold text-destructive mb-2">
                                Oops!
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                {error}
                            </p>
                            <Button
                                onClick={() => void loadList()}
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="flex-1 border-2 border-dashed border-border flex items-center justify-center min-h-[400px] bg-card/30">
                        <div className="flex flex-col items-center max-w-md text-center p-8">
                            <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center border-2 border-border -rotate-3">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">
                                No scans yet
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Running OCR on documents will automatically save
                                them here to refer back to later.
                            </p>
                            <Button
                                className="border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold tracking-tight"
                                asChild
                            >
                                <Link to="/app">
                                    Start your first scan{" "}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                        {jobs.map((job) => (
                            <Card
                                key={job.id}
                                className="group relative z-20 flex flex-col h-full border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer bg-card/95 backdrop-blur-sm overflow-hidden"
                                onClick={() => handleOpenJob(job.id)}
                            >
                                <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <CardHeader className="pb-3 flex-none">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <Badge
                                            variant="outline"
                                            className="border-border shadow-sm text-xs font-semibold shrink-0 bg-background/50"
                                        >
                                            {job.detectedLanguage ||
                                                job.language ||
                                                "Auto"}
                                        </Badge>
                                        <div
                                            className="flex items-center text-xs text-muted-foreground font-mono shrink-0"
                                            title={new Date(
                                                job.createdAt,
                                            ).toLocaleString()}
                                        >
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(
                                                job.createdAt,
                                            ).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                    <CardTitle
                                        className="text-base leading-tight truncate"
                                        title={job.originalFilename}
                                    >
                                        {truncateFilename(
                                            job.originalFilename,
                                            35,
                                        )}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col min-h-0">
                                    <div className="relative flex-1 bg-muted/30 border border-border p-3 text-sm font-serif overflow-hidden min-h-[100px] max-h-[140px]">
                                        <div className="absolute top-0 right-0 p-1 opacity-10">
                                            <FileText className="w-16 h-16" />
                                        </div>
                                        <div
                                            className="relative z-10 text-muted-foreground line-clamp-5 leading-relaxed wrap-break-word"
                                            style={{
                                                wordBreak: "break-word",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {job.preview ||
                                                "No text preview available..."}
                                        </div>
                                        {/* Fade out bottom text */}
                                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-muted/30 to-transparent pointer-events-none" />
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-2 pb-4 flex-none border-t border-border/50 bg-muted/10 transition-colors relative z-20">
                                    <div className="flex items-center text-xs font-semibold text-foreground transition-colors uppercase tracking-wider w-full justify-between">
                                        <div className="flex items-center gap-2 transition-colors">
                                            <span>
                                                Confidence:{" "}
                                                {job.confidence
                                                    ? Math.round(
                                                        job.confidence,
                                                    ) + "%"
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                onPointerDown={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground z-30 cursor-pointer"
                                                            disabled={
                                                                deletingId ===
                                                                job.id
                                                            }
                                                        >
                                                            {deletingId ===
                                                                job.id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                            <span className="sr-only">
                                                                Delete scan
                                                            </span>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card rounded-none sm:rounded-none z-50">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-lg md:text-xl font-bold tracking-tight mb-2">
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="text-foreground/80 font-medium text-base">
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete your OCR
                                                                scan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="mt-2 sm:space-x-4">
                                                            <AlertDialogCancel className="border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold tracking-tight rounded-none">
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    void handleDeleteJob(
                                                                        job.id,
                                                                    )
                                                                }
                                                                className="bg-destructive text-destructive-foreground border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-destructive/90 hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all font-bold tracking-tight rounded-none"
                                                            >
                                                                Yes, Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            <MousePointerClick className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Toaster
                theme="light"
                position="bottom-right"
                toastOptions={{
                    style: {
                        borderRadius: "0px",
                        border: "2px solid var(--border)",
                        boxShadow: "var(--shadow-sm)",
                    },
                }}
            />
        </div>
    );
}
