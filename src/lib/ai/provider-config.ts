export type AIProviderName = "openai" | "gemini";

export type AIProviderConfig = {
  provider: AIProviderName;
  isConfigured: boolean;
  missingKey: "OPENAI_API_KEY" | "GEMINI_API_KEY" | null;
  model: string;
};

export function getAIProviderConfig(env: Record<string, string | undefined> = process.env): AIProviderConfig {
  const selectedProvider = env.AI_PROVIDER || "openai";

  if (selectedProvider === "openai") {
    const isConfigured = Boolean(env.OPENAI_API_KEY);
    return {
      provider: selectedProvider,
      isConfigured,
      missingKey: isConfigured ? null : "OPENAI_API_KEY",
      model: env.OPENAI_MODEL || "gpt-5-mini",
    };
  }

  if (selectedProvider === "gemini") {
    const isConfigured = Boolean(env.GEMINI_API_KEY);
    return {
      provider: selectedProvider,
      isConfigured,
      missingKey: isConfigured ? null : "GEMINI_API_KEY",
      model: env.GEMINI_MODEL || "gemini-3.8-flash",
    };
  }

  throw new Error("AI_PROVIDER deve ser 'openai' ou 'gemini'.");
}
