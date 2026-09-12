import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export function AppShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold">{title}</h1>
              {description ? <p className="text-muted-foreground">{description}</p> : null}
            </div>
            {action}
          </div>
          <DisclaimerBanner compact />
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
