import { describe, expect, it } from "vitest";
import { getAIProviderConfig } from "@/lib/ai/provider-config";

describe("configuração do provider de IA", () => {
  it("usa OpenAI como padrão e requer a chave correspondente", () => {
    expect(getAIProviderConfig({})).toEqual({
      provider: "openai",
      isConfigured: false,
      missingConfiguration: "OPENAI_API_KEY",
      model: "gpt-5-mini",
    });
  });

  it("seleciona Gemini e usa o modelo configurado sem retornar a chave", () => {
    expect(getAIProviderConfig({
      AI_PROVIDER: "gemini",
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-test-model",
    })).toEqual({
      provider: "gemini",
      isConfigured: true,
      missingConfiguration: null,
      model: "gemini-test-model",
    });
  });

  it("usa o modelo Gemini padrão e indica a chave ausente", () => {
    expect(getAIProviderConfig({ AI_PROVIDER: "gemini" })).toEqual({
      provider: "gemini",
      isConfigured: false,
      missingConfiguration: "GEMINI_API_KEY",
      model: "gemini-3.8-flash",
    });
  });

  it("rejeita um provider desconhecido", () => {
    expect(() => getAIProviderConfig({ AI_PROVIDER: "unknown" }))
      .toThrow("AI_PROVIDER deve ser 'openai', 'gemini' ou 'openrouter'.");
  });

  it("seleciona OpenRouter com chave e modelo configurados sem retornar a chave", () => {
    expect(getAIProviderConfig({
      AI_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: "test-key",
      OPENROUTER_MODEL: "provider/model",
    })).toEqual({
      provider: "openrouter",
      isConfigured: true,
      missingConfiguration: null,
      model: "provider/model",
    });
  });

  it("indica a chave ou o modelo OpenRouter ausente", () => {
    expect(getAIProviderConfig({ AI_PROVIDER: "openrouter" })).toMatchObject({
      isConfigured: false,
      missingConfiguration: "OPENROUTER_API_KEY",
      model: "",
    });
    expect(getAIProviderConfig({ AI_PROVIDER: "openrouter", OPENROUTER_API_KEY: "test-key" }))
      .toMatchObject({ isConfigured: false, missingConfiguration: "OPENROUTER_MODEL" });
  });
});
