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

import { OpenRouterSynopsisProvider } from "@/lib/ai/openrouter-synopsis-provider";

describe("OpenRouterSynopsisProvider", () => {
  beforeEach(() => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    vi.stubEnv("OPENROUTER_MODEL", "provider/model");
    createCompletion.mockReset();
    createClient.mockReset();
  });

  it("envia o prompt compartilhado e retorna o texto da resposta", async () => {
    createCompletion.mockResolvedValue({
      choices: [{ message: { content: "  Uma aventura envolvente.  " } }],
    });
    const provider = new OpenRouterSynopsisProvider();

    await expect(provider.generate({ title: "Hollow Knight", platform: "Switch", genre: "Metroidvania" }))
      .resolves.toBe("Uma aventura envolvente.");

    expect(createClient).toHaveBeenCalledWith({
      apiKey: "test-key",
      baseURL: "https://openrouter.ai/api/v1",
    });
    expect(createCompletion).toHaveBeenCalledWith({
      model: "provider/model",
      messages: [
        {
          role: "system",
          content: "Escreva uma sinopse curta, envolvente e factual de um jogo. Não invente detalhes específicos se não tiver certeza. Responda em português brasileiro, em um único parágrafo, sem mencionar que é uma IA.",
        },
        { role: "user", content: "Título: Hollow Knight\nPlataforma: Switch\nGênero: Metroidvania" },
      ],
      max_tokens: 180,
    });
  });

  it("rejeita uma resposta vazia", async () => {
    createCompletion.mockResolvedValue({ choices: [{ message: { content: "  " } }] });
    const provider = new OpenRouterSynopsisProvider();

    await expect(provider.generate({ title: "Jogo", platform: "PC", genre: "Ação" }))
      .rejects.toThrow("A IA não retornou uma sinopse.");
  });
});
