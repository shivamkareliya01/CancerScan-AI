export type Prediction = "Cancerous" | "Non-Cancerous";

export interface AnalysisResult {
  prediction: Prediction;
  confidence: number; // 0 - 100
  notes: string;
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please choose a JPG or PNG image.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "That image is larger than 10 MB. Please choose a smaller file.";
  }
  return null;
}

/**
 * Placeholder prediction routine.
 * Replace the body with a call to the real model API when it is available.
 */
export async function analyzeImage(file: File): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 2200));

  // Deterministic pseudo-result so the same file always demos the same way.
  const seed = (file.size + file.name.length) % 100;
  const prediction: Prediction = seed % 2 === 0 ? "Non-Cancerous" : "Cancerous";
  const confidence = Math.round((72 + (seed % 26) + Math.random() * 2) * 10) / 10;

  return {
    prediction,
    confidence: Math.min(confidence, 99.4),
    notes:
      prediction === "Cancerous"
        ? "Model highlighted a dense irregular region with atypical nuclei patterns."
        : "No atypical region exceeded the model's detection threshold.",
  };
}

export function formatConfidence(value: number) {
  return `${value.toFixed(1)}%`;
}
