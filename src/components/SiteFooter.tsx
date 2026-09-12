import { Link } from "@tanstack/react-router";
import { Microscope } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <Microscope aria-hidden className="size-5 text-primary" />
            <span className="font-display text-base font-semibold">CancerScan AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            An open research and teaching prototype for AI-assisted early cancer detection screening.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <a
            href="mailto:research@cancerscan.example"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
          <Link
            to="/about"
            hash="disclaimer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Disclaimer
          </Link>
        </nav>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        Not a medical device. For research and education only.
      </div>
    </footer>
  );
}
