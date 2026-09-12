import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

export function SiteHeader() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Microscope aria-hidden className="size-5" />
          </span>
          <span className="font-display text-base font-semibold tracking-tight">CancerScan AI</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 text-sm md:flex">
          {user ? (
            <>
              <Link
                to="/upload"
                className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                Upload
              </Link>
              <Link
                to="/history"
                className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                History
              </Link>
              <Link
                to="/account"
                className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                Account
              </Link>
            </>
          ) : null}
          <Link
            to="/about"
            className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-40 animate-pulse rounded-md bg-muted" aria-hidden />
          ) : user ? (
            <>
              <Button asChild size="sm">
                <Link to="/upload">New scan</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
