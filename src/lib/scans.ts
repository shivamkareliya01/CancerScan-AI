import { supabase } from "@/integrations/supabase/client";

export interface ScanRow {
  id: string;
  user_id: string;
  image_path: string;
  file_name: string | null;
  prediction: string;
  confidence: number;
  notes: string | null;
  created_at: string;
}

export async function listScans(): Promise<ScanRow[]> {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ScanRow[];
}

export async function getScan(id: string): Promise<ScanRow> {
  const { data, error } = await supabase.from("scans").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Scan not found");
  return data as ScanRow;
}

export async function signedImageUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from("scans").createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}
