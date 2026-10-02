import { beforeEach, describe, expect, it, vi } from "vitest";

const { createCompletion, createClient } = vi.hoisted(() => ({
  createCompletion: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("openai", () => ({
  default: class MockOpenAI {
    chat = { completions: { create: createCompletion } };

    constructor(options: unknown) {
      createClient(options);
    }
  },
}));

import { GeminiSynopsisProvider } from "@/lib/ai/gemini-synopsis-provider";

describe("GeminiSynopsisProvider", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GEMINI_MODEL", "gemini-test-model");
    vi.stubEnv("OPENAI_API_KEY", "openai-test-key");
    createCompletion.mockReset();
  });

  it("envia contexto e instruções ao endpoint Gemini e retorna o texto", async () => {
    createCompletion.mockResolvedValue({
      choices: [{ message: { content: "  Uma aventura envolvente.  " } }],
    });
    const provider = new GeminiSynopsisProvider();

    await expect(provider.generate({ title: "Hollow Knight", platform: "Switch", genre: "Metroidvania" }))
      .resolves.toBe("Uma aventura envolvente.");

    expect(createCompletion).toHaveBeenCalledWith({
      model: "gemini-test-model",
      messages: [
        {
          role: "system",
          content: "Escreva uma sinopse curta, envolvente e factual de um jogo. Não invente detalhes específicos se não tiver certeza. Responda em português brasileiro, em um único parágrafo, sem mencionar que é uma IA.",
        },
        { role: "user", content: "Título: Hollow Knight\nPlataforma: Switch\nGênero: Metroidvania" },
      ],
      max_tokens: 180,
    });
    expect(createClient).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    }));
    expect((createClient.mock.calls[0][0] as { apiKey?: string }).apiKey).toBe(process.env.GEMINI_API_KEY);
  });

  it("rejeita uma resposta vazia", async () => {
    createCompletion.mockResolvedValue({ choices: [{ message: { content: "  " } }] });
    const provider = new GeminiSynopsisProvider();

    await expect(provider.generate({ title: "Jogo", platform: "PC", genre: "Ação" }))
      .rejects.toThrow("A IA não retornou uma sinopse.");
  });
});
