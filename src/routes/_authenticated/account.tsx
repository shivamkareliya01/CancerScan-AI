import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
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

const ROLES = ["Doctor", "Researcher", "Other"] as const;

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your account — CancerScan AI" },
      { name: "description", content: "View and update your name, role and email on CancerScan AI." },
      { property: "og:title", content: "Your account — CancerScan AI" },
      { property: "og:description", content: "View and update your name, role and email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("Other");
  const [saving, setSaving] = useState(false);

  const { data: profile, isPending } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const id = userData.user?.id;
      if (!id) throw new Error("No session");
      const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return { ...data, email: data?.email ?? userData.user?.email ?? "", id };
    },
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setRole(profile.role ?? "Other");
    }
  }, [profile]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!profile) return;
    if (name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: profile.id, name: name.trim(), role, email: profile.email });
    setSaving(false);
    if (error) {
      toast.error("We couldn't save your changes. Please try again.");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile updated.");
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <AppShell title="Your account" description="Update how you appear in CancerScan AI.">
      {isPending ? (
        <div className="h-72 animate-pulse rounded-2xl bg-muted" aria-hidden />
      ) : (
        <form
          onSubmit={handleSave}
          className="max-w-lg space-y-5 rounded-2xl border bg-card p-6 shadow-[var(--shadow-clinical)]"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue />
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={profile?.email ?? ""} readOnly disabled />
            <p className="text-xs text-muted-foreground">
              Your email is tied to your login and can't be changed here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              Log out
            </Button>
          </div>
        </form>
      )}
    </AppShell>
  );
}
