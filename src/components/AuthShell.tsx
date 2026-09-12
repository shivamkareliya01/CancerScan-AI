import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Microscope } from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import cellsTeal from "@/assets/cells-teal.jpg";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="flex flex-col justify-center px-4 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md space-y-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Microscope aria-hidden className="size-5" />
            </span>
            <span className="font-display text-base font-semibold">CancerScan AI</span>
          </Link>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          {footer ? <div className="text-sm text-muted-foreground">{footer}</div> : null}

          <DisclaimerBanner compact />
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-secondary lg:block">
        <img
          src={cellsTeal}
          alt="Cell tissue viewed through a microscope in teal tones"
          width={1200}
          height={800}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/25 to-transparent" />
        <blockquote className="absolute bottom-10 left-10 right-10 rounded-2xl bg-card/85 p-6 backdrop-blur-sm">
          <p className="font-display text-lg leading-snug">
            Screening support that shows its reasoning — never a replacement for a clinician.
          </p>
          <footer className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
            CancerScan AI · Research prototype
          </footer>
        </blockquote>
      </aside>
    </main>
  );
}
