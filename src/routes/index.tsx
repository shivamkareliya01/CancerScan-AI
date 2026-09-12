import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, LineChart, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/lib/use-auth";
import heroCells from "@/assets/hero-cells.jpg";
import heatmapSample from "@/assets/heatmap-sample.jpg";
import cellsTeal from "@/assets/cells-teal.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CancerScan AI — AI-Assisted Early Cancer Detection Screening" },
      {
        name: "description",
        content:
          "CancerScan AI is a research and educational prototype that analyses medical images and returns a screening prediction with a confidence score and heatmap.",
      },
      { property: "og:title", content: "CancerScan AI — AI-Assisted Early Cancer Detection Screening" },
      {
        property: "og:description",
        content:
          "Upload a medical image, let the model analyse it, and review a prediction with confidence and a highlighted region. Research prototype only.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: Upload,
    title: "Upload an image",
    body: "Drag in a JPG or PNG histopathology or scan image. Files stay private to your account.",
  },
  {
    icon: Brain,
    title: "The model analyses it",
    body: "The screening model examines tissue structure and flags the regions that drove its decision.",
  },
  {
    icon: LineChart,
    title: "Review the result",
    body: "Get a clear label, a confidence gauge and a heatmap overlay — saved to your history.",
  },
];

function Landing() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 surface-grid opacity-60" aria-hidden />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
                Research prototype
              </span>
              <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
                <span className="text-gradient-clinical">AI-Assisted Early Cancer</span>
                <br />
                Detection Screening
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                CancerScan AI reads a medical image and returns a screening prediction, a confidence score
                and a visual explanation — built for study, teaching and model exploration.
              </p>

              <div className="flex flex-wrap gap-3">
                {loading ? (
                  <div className="h-10 w-64 animate-pulse rounded-md bg-muted" aria-hidden />
                ) : user ? (
                  <Button asChild size="lg">
                    <Link to="/upload">
                      Go to dashboard <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link to="/signup">
                        Sign up <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/login">Login</Link>
                    </Button>
                  </>
                )}
              </div>

              
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-lift)]">
                <img
                  src={heroCells}
                  alt="Cancer cell cluster under a microscope, stained in blue and teal"
                  width={1600}
                  height={1104}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden w-56 overflow-hidden rounded-2xl border bg-card p-3 shadow-[var(--shadow-clinical)] sm:block">
                <img
                  src={heatmapSample}
                  alt="Tissue slide with an AI heatmap overlay highlighting a suspicious region"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <p className="mt-2 px-1 text-xs text-muted-foreground">
                  Heatmap overlay marks the region behind the prediction.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl space-y-3">
            <h2 className="font-display text-3xl font-semibold">How it works</h2>
            <p className="text-muted-foreground">Three steps from image to reviewable result.</p>
          </div>

          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="group rounded-2xl border bg-card p-6 shadow-[var(--shadow-clinical)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <step.icon aria-hidden className="size-5" />
                  </span>
                  <span className="font-display text-4xl font-semibold text-muted">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y bg-secondary/50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div className="overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-clinical)]">
              <img
                src={cellsTeal}
                alt="Healthy cell tissue sample in soft teal tones under a microscope"
                width={1200}
                height={800}
                loading="lazy"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-semibold">Built to be questioned</h2>
              <p className="text-muted-foreground">
                Every result pairs the label with a confidence value and the highlighted region that drove
                it, so a prediction can be examined rather than simply trusted. Results are stored against
                your account so you can revisit and compare them.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">Read the methodology</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
