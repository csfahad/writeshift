import { useMemo } from "react";

const STORAGE_KEY = "writeshift-guest-id";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function readOrCreateGuestId(): string {
    if (typeof window === "undefined") return "";
    try {
        let id = localStorage.getItem(STORAGE_KEY);
        if (!id || !UUID_RE.test(id)) {
            id = crypto.randomUUID();
            localStorage.setItem(STORAGE_KEY, id);
        }
        return id;
    } catch {
        return crypto.randomUUID();
    }
}

export function useGuestId(): string {
    return useMemo(() => readOrCreateGuestId(), []);
}
