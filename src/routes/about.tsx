import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import heatmapSample from "@/assets/heatmap-sample.jpg";
import heroCells from "@/assets/hero-cells.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the method — CancerScan AI" },
      {
        name: "description",
        content:
          "How the CancerScan AI screening prototype works: the dataset, the model, how confidence and heatmaps are produced, and its limits.",
      },
      { property: "og:title", content: "About the method — CancerScan AI" },
      {
        property: "og:description",
        content: "Plain-language explanation of the dataset, model and limits behind the CancerScan AI prototype.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b bg-secondary/40">
          <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
            <h1 className="font-display text-4xl font-semibold">About CancerScan AI</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              A teaching and research prototype that shows how an image-based screening model behaves — what
              it predicts, how sure it is, and which part of the image drove the answer.
            </p>
          </div>
        </section>

        <article className="mx-auto max-w-4xl space-y-12 px-4 py-14 sm:px-6">
          <div className="overflow-hidden rounded-3xl border shadow-[var(--shadow-clinical)]">
            <img
              src={heroCells}
              alt="Cluster of stained cells photographed through a microscope"
              width={1600}
              height={1104}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">The dataset</h2>
            <p className="leading-relaxed text-muted-foreground">
              Placeholder text. The prototype is designed around publicly available, de-identified
              histopathology image collections, split into training, validation and held-out test sets at the
              patient level so that slides from one patient never appear in more than one split. Images are
              resized, colour-normalised and augmented with rotations and flips before training.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl font-semibold">The model</h2>
            <p className="leading-relaxed text-muted-foreground">
              Placeholder text. A convolutional image classifier produces a single probability that a given
              image contains malignant tissue. That probability is reported directly as the confidence score
              you see on a result. A score near 50% means the model is genuinely unsure — it is not a measure
              of how serious a finding is.
            </p>
          </section>

          <section className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-3">
              <h2 className="font-display text-2xl font-semibold">Why the heatmap</h2>
              <p className="leading-relaxed text-muted-foreground">
                Placeholder text. The overlay is produced with a gradient-based attribution method that marks
                the pixels most responsible for the model's output. It is an explanation of the model, not a
                clinical annotation — a convincing-looking heatmap can still sit on top of a wrong answer.
              </p>
            </div>
            <img
              src={heatmapSample}
              alt="Tissue slide with a red and orange heatmap marking the region that drove the prediction"
              width={1024}
              height={1024}
              loading="lazy"
              className="aspect-square w-full rounded-2xl border object-cover shadow-[var(--shadow-clinical)]"
            />
          </section>

          <section id="disclaimer" className="scroll-mt-24 space-y-4">
            <h2 className="font-display text-2xl font-semibold">Disclaimer</h2>
            <DisclaimerBanner />
            <p className="leading-relaxed text-muted-foreground">
              Nothing in this application has been reviewed or approved by any medical regulator. Do not use
              it to make, delay or change a decision about anyone's care.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
