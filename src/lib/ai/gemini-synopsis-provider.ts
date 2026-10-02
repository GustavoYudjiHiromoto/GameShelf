import "server-only";
import OpenAI from "openai";
import type { GameSynopsisContext, SynopsisProvider } from "@/lib/ai/synopsis-provider";

const GEMINI_OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const SYNOPSIS_INSTRUCTIONS =
  "Escreva uma sinopse curta, envolvente e factual de um jogo. Não invente detalhes específicos se não tiver certeza. Responda em português brasileiro, em um único parágrafo, sem mencionar que é uma IA.";

export class GeminiSynopsisProvider implements SynopsisProvider {
  private readonly client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY ?? "",
    baseURL: GEMINI_OPENAI_BASE_URL,
  });

  async generate(game: GameSynopsisContext) {
    const response = await this.client.chat.completions.create({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      messages: [
        { role: "system", content: SYNOPSIS_INSTRUCTIONS },
        { role: "user", content: `Título: ${game.title}\nPlataforma: ${game.platform}\nGênero: ${game.genre}` },
      ],
      max_tokens: 180,
    });

    const synopsis = response.choices[0]?.message.content?.trim();
    if (!synopsis) throw new Error("A IA não retornou uma sinopse.");
    return synopsis;
  }
}

export function createGeminiSynopsisProvider(): SynopsisProvider {
  return new GeminiSynopsisProvider();
}
