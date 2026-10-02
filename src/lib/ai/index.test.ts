import { beforeEach, describe, expect, it, vi } from "vitest";

const { openAIFactory, geminiFactory } = vi.hoisted(() => ({
  openAIFactory: vi.fn(() => ({ generate: vi.fn() })),
  geminiFactory: vi.fn(() => ({ generate: vi.fn() })),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/ai/openai-synopsis-provider", () => ({
  createOpenAISynopsisProvider: openAIFactory,
}));
vi.mock("@/lib/ai/gemini-synopsis-provider", () => ({
  createGeminiSynopsisProvider: geminiFactory,
}));

import { getSynopsisService } from "@/lib/ai";

describe("seleção do provider de sinopses", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    openAIFactory.mockClear();
    geminiFactory.mockClear();
  });

  it("mantém OpenAI como provider padrão", () => {
    getSynopsisService();

    expect(openAIFactory).toHaveBeenCalledOnce();
    expect(geminiFactory).not.toHaveBeenCalled();
  });

  it("seleciona Gemini quando AI_PROVIDER=gemini", () => {
    vi.stubEnv("AI_PROVIDER", "gemini");

    getSynopsisService();

    expect(geminiFactory).toHaveBeenCalledOnce();
    expect(openAIFactory).not.toHaveBeenCalled();
  });
});
