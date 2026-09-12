import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0-100
  tone?: "success" | "danger" | "primary";
  size?: number;
  label?: string;
}

export function ConfidenceGauge({ value, tone = "primary", size = 148, label = "Confidence" }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  const strokeClass =
    tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-primary";

  return (
    <figure
      className="flex flex-col items-center gap-2"
      role="img"
      aria-label={`${label}: ${clamped.toFixed(1)} percent`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 128 128" className="size-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="text-muted"
            stroke="currentColor"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            stroke="currentColor"
            className={cn(strokeClass, "transition-[stroke-dasharray] duration-700 ease-out")}
            strokeDasharray={`${dash} ${circumference - dash}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold tabular-nums">{clamped.toFixed(1)}%</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </figure>
  );
}
