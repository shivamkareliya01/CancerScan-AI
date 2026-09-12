import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { GoogleButton } from "@/components/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { friendlyAuthError } from "@/lib/use-auth";

export const ROLES = ["Doctor", "Researcher", "Other"] as const;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — CancerScan AI" },
      {
        name: "description",
        content: "Create a CancerScan AI account to analyse medical images and keep a private history of your screening results.",
      },
      { property: "og:title", content: "Create an account — CancerScan AI" },
      { property: "og:description", content: "Create an account to analyse medical images and keep a private result history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("Researcher");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next['name'] = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next['email'] = "Enter a valid email address.";
    if (password.length < 8) next['password'] = "Use at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: name.trim(), role },
      },
    });
    setPending(false);

    if (error) {
      toast.error(friendlyAuthError(error.message));
      return;
    }
    if (data.session) {
      navigate({ to: "/upload" });
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`We sent a confirmation link to ${email}. Click it to activate your account, then log in.`}
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            Go to login
          </Link>
        }
      >
        <div />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up an account to analyse images and keep your results together."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors['name'])}
          />
          {errors['name'] ? <p className="text-xs text-destructive">{errors['name']}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors['email'])}
          />
          {errors['email'] ? <p className="text-xs text-destructive">{errors['email']}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors['password'])}
          />
          {errors['password'] ? <p className="text-xs text-destructive">{errors['password']}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" />
    </AuthShell>
  );
}
