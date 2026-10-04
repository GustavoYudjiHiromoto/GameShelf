import "server-only";
import OpenAI from "openai";
import type { GameSynopsisContext, SynopsisProvider } from "@/lib/ai/synopsis-provider";
import { formatSynopsisContext, SYNOPSIS_INSTRUCTIONS } from "@/lib/ai/synopsis-prompt";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export class OpenRouterSynopsisProvider implements SynopsisProvider {
  private readonly client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    baseURL: OPENROUTER_BASE_URL,
  });

  async generate(game: GameSynopsisContext) {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL ?? "",
      messages: [
        { role: "system", content: SYNOPSIS_INSTRUCTIONS },
        { role: "user", content: formatSynopsisContext(game) },
      ],
      max_tokens: 180,
    });

    const synopsis = response.choices[0]?.message.content?.trim();
    if (!synopsis) throw new Error("A IA não retornou uma sinopse.");
    return synopsis;
  }
}

export function createOpenRouterSynopsisProvider(): SynopsisProvider {
  return new OpenRouterSynopsisProvider();
}
