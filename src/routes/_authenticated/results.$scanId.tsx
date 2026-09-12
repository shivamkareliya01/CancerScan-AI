import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { ConfidenceGauge } from "@/components/ConfidenceGauge";
import { getScan, signedImageUrl } from "@/lib/scans";
import heatmapSample from "@/assets/heatmap-sample.jpg";

export const Route = createFileRoute("/_authenticated/results/$scanId")({
  head: () => ({
    meta: [
      { title: "Screening result — CancerScan AI" },
      { name: "description", content: "Prediction, confidence score and heatmap overlay for your analysed image." },
      { property: "og:title", content: "Screening result — CancerScan AI" },
      { property: "og:description", content: "Prediction, confidence score and heatmap overlay for your analysed image." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const { scanId } = Route.useParams();
  const [showHeatmap, setShowHeatmap] = useState(true);

  const { data, isPending, isError } = useQuery({
    queryKey: ["scan", scanId],
    queryFn: async () => {
      const row = await getScan(scanId);
      return { row, url: await signedImageUrl(row.image_path) };
    },
  });

  if (isPending) {
    return (
      <AppShell title="Screening result">
        <div className="h-96 animate-pulse rounded-2xl bg-muted" aria-hidden />
      </AppShell>
    );
  }

  if (isError || !data) {
    return (
      <AppShell title="Screening result">
        <div className="space-y-4 rounded-2xl border bg-card p-8">
          <p className="text-muted-foreground">We couldn't find that result.</p>
          <Button asChild>
            <Link to="/history">Back to history</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const { row, url } = data;
  const cancerous = row.prediction === "Cancerous";
  const confidence = Number(row.confidence);
  const Icon = cancerous ? AlertTriangle : CheckCircle2;

  return (
    <AppShell
      title="Screening result"
      description={`Analysed ${new Date(row.created_at).toLocaleString()}`}
      action={
        <Button asChild>
          <Link to="/upload">Analyze another image</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className="overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-clinical)]">
          <div className="relative aspect-square bg-muted">
            {url ? (
              <img src={url} alt={row.file_name ?? "Analysed medical image"} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                Image unavailable
              </div>
            )}
            {showHeatmap ? (
              <img
                src={heatmapSample}
                alt="Placeholder heatmap overlay highlighting the region behind the prediction"
                loading="lazy"
                className="pointer-events-none absolute inset-0 size-full object-cover mix-blend-multiply opacity-70"
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-4 border-t p-4">
            <p className="text-sm text-muted-foreground">
              Heatmap overlay <span className="font-medium text-foreground">(placeholder)</span>
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowHeatmap((v) => !v)}>
              {showHeatmap ? "Hide overlay" : "Show overlay"}
            </Button>
          </div>
        </section>

        <section className="space-y-6">
          <div
            className={
              cancerous
                ? "space-y-4 rounded-2xl border border-danger/40 bg-danger-soft p-6"
                : "space-y-4 rounded-2xl border border-success/40 bg-success-soft p-6"
            }
          >
            <div className="flex items-center gap-3">
              <Icon aria-hidden className={cancerous ? "size-7 text-danger" : "size-7 text-success"} />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Prediction</p>
                <p className="font-display text-2xl font-semibold">{row.prediction}</p>
              </div>
            </div>
            {cancerous ? (
              <p className="flex items-start gap-2 text-sm font-medium text-danger">
                <Stethoscope aria-hidden className="mt-0.5 size-4 shrink-0" />
                Please consult a licensed doctor. This prototype cannot diagnose anything.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No atypical region passed the model's threshold. A negative screening result never rules out
                disease — clinical review still applies.
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-6 shadow-[var(--shadow-clinical)]">
            <ConfidenceGauge value={confidence} tone={cancerous ? "danger" : "success"} />
            <p className="text-center text-sm text-muted-foreground">
              How certain the model is about the label above — not a measure of severity.
            </p>
          </div>

          {row.notes ? (
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-display text-base font-semibold">Model note</h2>
              <p className="mt-2 text-sm text-muted-foreground">{row.notes}</p>
            </div>
          ) : null}

          <Button asChild variant="outline" className="w-full">
            <Link to="/history">View all scans</Link>
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
