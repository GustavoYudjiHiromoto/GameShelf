import { beforeEach, describe, expect, it, vi } from "vitest";

const { openAIFactory, geminiFactory, openRouterFactory } = vi.hoisted(() => ({
  openAIFactory: vi.fn(() => ({ generate: vi.fn() })),
  geminiFactory: vi.fn(() => ({ generate: vi.fn() })),
  openRouterFactory: vi.fn(() => ({ generate: vi.fn() })),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/ai/openai-synopsis-provider", () => ({
  createOpenAISynopsisProvider: openAIFactory,
}));
vi.mock("@/lib/ai/gemini-synopsis-provider", () => ({
  createGeminiSynopsisProvider: geminiFactory,
}));
vi.mock("@/lib/ai/openrouter-synopsis-provider", () => ({
  createOpenRouterSynopsisProvider: openRouterFactory,
}));

import { getSynopsisService } from "@/lib/ai";

describe("seleção do provider de sinopses", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    openAIFactory.mockClear();
    geminiFactory.mockClear();
    openRouterFactory.mockClear();
  });

  it("mantém OpenAI como provider padrão", () => {
    getSynopsisService();

    expect(openAIFactory).toHaveBeenCalledOnce();
    expect(geminiFactory).not.toHaveBeenCalled();
    expect(openRouterFactory).not.toHaveBeenCalled();
  });

  it("seleciona Gemini quando AI_PROVIDER=gemini", () => {
    vi.stubEnv("AI_PROVIDER", "gemini");

    getSynopsisService();

    expect(geminiFactory).toHaveBeenCalledOnce();
    expect(openAIFactory).not.toHaveBeenCalled();
    expect(openRouterFactory).not.toHaveBeenCalled();
  });

  it("seleciona OpenRouter quando AI_PROVIDER=openrouter", () => {
    vi.stubEnv("AI_PROVIDER", "openrouter");

    getSynopsisService();

    expect(openRouterFactory).toHaveBeenCalledOnce();
    expect(openAIFactory).not.toHaveBeenCalled();
    expect(geminiFactory).not.toHaveBeenCalled();
  });
});
