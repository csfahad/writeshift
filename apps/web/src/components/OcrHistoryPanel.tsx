import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_API_URL!;

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

export interface LoadedOcrJob {
    id: string;
    createdAt: string;
    originalFilename: string;
    mimeType: string;
    language: string;
    text: string;
    confidence: number;
    detectedLanguage: string;
    paragraphs: string[];
}

interface OcrHistoryPanelProps {
    refreshKey: number;
    onLoadJob: (job: LoadedOcrJob) => void;
}

export function OcrHistoryPanel({ refreshKey, onLoadJob }: OcrHistoryPanelProps) {
    const { isSignedIn, getToken } = useAuth();
    const [jobs, setJobs] = useState<OcrJobSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadList = useCallback(async () => {
        if (!isSignedIn) {
            setJobs([]);
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
        void loadList();
    }, [loadList, refreshKey]);

    const handleOpenJob = async (id: string) => {
        setLoadingId(id);
        setError(null);
        try {
            const token = await getToken();
            if (!token) return;
            const res = await fetch(`${API_URL}/api/ocr/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = (await res.json()) as LoadedOcrJob & {
                error?: string;
            };
            if (!res.ok) {
                setError(data.error || "Could not open scan");
                return;
            }
            onLoadJob(data);
        } catch {
            setError("Could not open scan");
        } finally {
            setLoadingId(null);
        }
    };

    if (!isSignedIn) return null;

    return (
        <Card className="border-2 border-border shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <CardTitle className="text-base">Past scans</CardTitle>
                </div>
                <CardDescription>
                    Open a completed OCR to edit or export again.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {loading && jobs.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading…
                    </div>
                ) : jobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-1">
                        No saved scans yet. Run OCR while signed in to build your
                        history.
                    </p>
                ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {jobs.map((job) => (
                            <li key={job.id}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-auto py-2 px-3 border-2 border-border justify-start text-left font-normal shadow-xs"
                                    onClick={() => void handleOpenJob(job.id)}
                                    disabled={loadingId === job.id}
                                >
                                    <div className="flex flex-col gap-1 w-full min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold truncate max-w-[180px]">
                                                {job.originalFilename}
                                            </span>
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px] shrink-0"
                                            >
                                                {new Date(
                                                    job.createdAt,
                                                ).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                        <span className="text-xs text-muted-foreground line-clamp-2">
                                            {job.preview}
                                        </span>
                                    </div>
                                    {loadingId === job.id ? (
                                        <Loader2 className="h-4 w-4 shrink-0 animate-spin ml-2" />
                                    ) : null}
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                {error ? (
                    <p className="text-xs text-destructive">{error}</p>
                ) : null}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => void loadList()}
                    disabled={loading}
                >
                    Refresh list
                </Button>
            </CardContent>
        </Card>
    );
}
