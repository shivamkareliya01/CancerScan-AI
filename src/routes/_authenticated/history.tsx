import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ImageOff } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { listScans, signedImageUrl, type ScanRow } from "@/lib/scans";
import { formatConfidence } from "@/lib/analysis";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Scan history — CancerScan AI" },
      { name: "description", content: "Every image you have analysed, with its prediction, confidence and date." },
      { property: "og:title", content: "Scan history — CancerScan AI" },
      { property: "og:description", content: "Every image you have analysed, with prediction, confidence and date." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["scans"],
    queryFn: async () => {
      const rows = await listScans();
      return Promise.all(
        rows.map(async (row) => ({ row, url: await signedImageUrl(row.image_path) })),
      );
    },
  });

  return (
    <AppShell
      title="Scan history"
      description="Everything you have analysed, newest first."
      action={
        <Button asChild>
          <Link to="/upload">New scan</Link>
        </Button>
      }
    >
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-64 animate-pulse rounded-2xl bg-muted" aria-hidden />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          We couldn't load your history. Please refresh and try again.
        </p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card p-12 text-center">
          <ImageOff aria-hidden className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium">No scans yet</p>
            <p className="text-sm text-muted-foreground">Analyse your first image to start a history.</p>
          </div>
          <Button asChild>
            <Link to="/upload">Upload an image</Link>
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(({ row, url }) => (
            <li key={row.id}>
              <HistoryCard row={row} url={url} />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function HistoryCard({ row, url }: { row: ScanRow; url: string | null }) {
  const cancerous = row.prediction === "Cancerous";
  const Icon = cancerous ? AlertTriangle : CheckCircle2;

  return (
    <Link
      to="/results/$scanId"
      params={{ scanId: row.id }}
      className="group block overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-clinical)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {url ? (
          <img
            src={url}
            alt={row.file_name ?? "Analysed medical image"}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Image unavailable
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div
          className={
            cancerous
              ? "inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger"
              : "inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"
          }
        >
          <Icon aria-hidden className="size-3.5" />
          {row.prediction}
        </div>
        <p className="truncate text-sm font-medium" title={row.file_name ?? undefined}>
          {row.file_name ?? "Untitled image"}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(row.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          · {formatConfidence(Number(row.confidence))} confidence
        </p>
      </div>
    </Link>
  );
}
