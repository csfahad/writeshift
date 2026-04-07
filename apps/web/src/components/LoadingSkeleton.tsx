import { Card } from "@/components/ui/card";

export function LoadingSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
                <div className="h-4 w-24 animate-shimmer rounded" />
            </div>
            <div className="p-6 space-y-4">
                {/* Simulated text lines with varying widths */}
                <div className="space-y-3">
                    <div className="h-3.5 w-full animate-shimmer rounded" style={{ animationDelay: "0ms" }} />
                    <div className="h-3.5 w-[92%] animate-shimmer rounded" style={{ animationDelay: "100ms" }} />
                    <div className="h-3.5 w-[87%] animate-shimmer rounded" style={{ animationDelay: "200ms" }} />
                    <div className="h-3.5 w-full animate-shimmer rounded" style={{ animationDelay: "300ms" }} />
                    <div className="h-3.5 w-[78%] animate-shimmer rounded" style={{ animationDelay: "400ms" }} />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                    <div className="h-3.5 w-[95%] animate-shimmer rounded" style={{ animationDelay: "500ms" }} />
                    <div className="h-3.5 w-full animate-shimmer rounded" style={{ animationDelay: "600ms" }} />
                    <div className="h-3.5 w-[83%] animate-shimmer rounded" style={{ animationDelay: "700ms" }} />
                    <div className="h-3.5 w-[90%] animate-shimmer rounded" style={{ animationDelay: "800ms" }} />
                    <div className="h-3.5 w-[65%] animate-shimmer rounded" style={{ animationDelay: "900ms" }} />
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3">
                    <div className="h-3.5 w-[88%] animate-shimmer rounded" style={{ animationDelay: "1000ms" }} />
                    <div className="h-3.5 w-[72%] animate-shimmer rounded" style={{ animationDelay: "1100ms" }} />
                    <div className="h-3.5 w-[45%] animate-shimmer rounded" style={{ animationDelay: "1200ms" }} />
                </div>
            </div>

            {/* Footer skeleton */}
            <div className="px-4 py-3 border-t border-border flex items-center gap-3">
                <div className="h-3 w-16 animate-shimmer rounded" />
                <div className="h-3 w-20 animate-shimmer rounded" />
            </div>
        </Card>
    );
}
