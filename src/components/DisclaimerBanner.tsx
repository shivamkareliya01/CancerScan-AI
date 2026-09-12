import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const DISCLAIMER_TEXT =
  "This is a research and educational prototype only. It is NOT a certified medical diagnostic tool and must not be used for real medical decisions. Always consult a licensed healthcare professional.";

export function DisclaimerBanner({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-soft px-4 py-3 text-warning-foreground",
        compact ? "text-xs" : "text-sm",
        className,
      )}
    >
      <ShieldAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
      <p className="leading-relaxed">
        <span className="font-semibold">Research prototype. </span>
        {DISCLAIMER_TEXT}
      </p>
    </aside>
  );
}
