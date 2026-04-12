import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL!;

export interface GuestOcrStatus {
    limit: number;
    used: number;
    remaining: number;
}

export function useGuestOcrStatus(
    guestId: string,
    isAuthenticated: boolean,
    refreshKey: number,
) {
    const [status, setStatus] = useState<GuestOcrStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchStatus = useCallback(async () => {
        if (isAuthenticated || !guestId) {
            setStatus(null);
            setError(null);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/ocr/guest-status`, {
                headers: { "X-Guest-Id": guestId },
            });
            const data = (await res.json()) as {
                mode?: string;
                limit?: number;
                used?: number;
                remaining?: number;
                error?: string;
            };
            if (!res.ok) {
                setError(data.error || "Could not load guest status");
                setStatus(null);
                return;
            }
            if (
                data.mode === "guest" &&
                data.limit != null &&
                data.used != null
            ) {
                setStatus({
                    limit: data.limit,
                    used: data.used,
                    remaining:
                        data.remaining ?? Math.max(0, data.limit - data.used),
                });
                setError(null);
            } else {
                setStatus(null);
            }
        } catch {
            setError("Could not load guest status");
            setStatus(null);
        }
    }, [guestId, isAuthenticated]);

    useEffect(() => {
        void fetchStatus();
    }, [fetchStatus, refreshKey]);

    return { status, error, refetch: fetchStatus };
}
