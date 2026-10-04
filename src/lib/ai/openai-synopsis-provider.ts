import "server-only";
import OpenAI from "openai";
import type { GameSynopsisContext, SynopsisProvider } from "@/lib/ai/synopsis-provider";
import { formatSynopsisContext, SYNOPSIS_INSTRUCTIONS } from "@/lib/ai/synopsis-prompt";

export class OpenAISynopsisProvider implements SynopsisProvider {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async generate(game: GameSynopsisContext) {
    const response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: SYNOPSIS_INSTRUCTIONS,
      input: formatSynopsisContext(game),
      max_output_tokens: 180,
    });

    const synopsis = response.output_text.trim();
    if (!synopsis) throw new Error("A IA não retornou uma sinopse.");
    return synopsis;
  }
}

export function createOpenAISynopsisProvider(): SynopsisProvider {
  return new OpenAISynopsisProvider();
}
