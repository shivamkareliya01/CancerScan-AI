import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImageUp, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { analyzeImage, validateImageFile } from "@/lib/analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  head: () => ({
    meta: [
      { title: "Upload & analyse — CancerScan AI" },
      { name: "description", content: "Upload a JPG or PNG medical image and run the screening model on it." },
      { property: "og:title", content: "Upload & analyse — CancerScan AI" },
      { property: "og:description", content: "Upload a medical image and run the screening model on it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = useCallback((next: File | undefined) => {
    if (!next) return;
    const message = validateImageFile(next);
    if (message) {
      setError(message);
      setFile(null);
      return;
    }
    setError("");
    setFile(next);
  }, []);

  async function handleAnalyze() {
    if (!file) return;
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Your session expired. Please log in again.");

      const result = await analyzeImage(file);

      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("scans")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: inserted, error: insertError } = await supabase
        .from("scans")
        .insert({
          user_id: userId,
          image_path: path,
          file_name: file.name,
          prediction: result.prediction,
          confidence: result.confidence,
          notes: result.notes,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;

      navigate({ to: "/results/$scanId", params: { scanId: inserted.id } });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Something went wrong.";
      toast.error(message);
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Upload & analyse"
      description="Drop in a JPG or PNG image, up to 10 MB. Your images stay private to your account."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files[0]);
          }}
          className={cn(
            "flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-card p-10 text-center transition-colors",
            dragging ? "border-primary bg-accent/40" : "border-border",
          )}
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <ImageUp aria-hidden className="size-6" />
          </span>
          <div className="space-y-1">
            <p className="font-medium">Drag an image here</p>
            <p className="text-sm text-muted-foreground">JPG or PNG · up to 10 MB</p>
          </div>
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={busy}>
            Choose a file
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="sr-only"
            aria-label="Choose an image to analyse"
            onChange={(e) => accept(e.target.files?.[0])}
          />
          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-clinical)]">
          <h2 className="font-display text-lg font-semibold">Preview</h2>
          {preview && file ? (
            <>
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <img src={preview} alt={`Preview of ${file.name}`} className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={busy}
                  aria-label="Remove selected image"
                  className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow transition-colors hover:bg-card"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
              <p className="truncate text-sm text-muted-foreground" title={file.name}>
                {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              No image selected
            </div>
          )}

          <Button className="w-full" onClick={handleAnalyze} disabled={!file || busy}>
            {busy ? (
              <>
                <Loader2 aria-hidden className="animate-spin" /> Analysing…
              </>
            ) : (
              "Analyze image"
            )}
          </Button>
          {busy ? (
            <p className="text-center text-xs text-muted-foreground">
              Running the screening model and saving your result…
            </p>
          ) : null}
        </aside>
      </div>
    </AppShell>
  );
}
