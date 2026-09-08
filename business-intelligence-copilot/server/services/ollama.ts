import { z } from "zod";

const briefSchema = z.object({
  summaryMarkdown: z.string(),
  outreachAngle: z.string(),
  redesignFocus: z.string(),
  homepageRecommendations: z.array(z.string()).min(3).max(5),
});

export async function generateBriefWithOllama(prompt: string): Promise<z.infer<typeof briefSchema> | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"}/api/generate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL ?? "llama3.1:8b",
        stream: false,
        format: "json",
        prompt,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { response?: string };
    if (!payload.response) {
      return null;
    }

    const parsed = JSON.parse(payload.response);
    const result = briefSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
