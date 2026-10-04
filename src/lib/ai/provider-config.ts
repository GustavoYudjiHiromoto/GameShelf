export type AIProviderName = "openai" | "gemini" | "openrouter";
export type AIMissingConfiguration = "OPENAI_API_KEY" | "GEMINI_API_KEY" | "OPENROUTER_API_KEY" | "OPENROUTER_MODEL";

export type AIProviderConfig = {
  provider: AIProviderName;
  isConfigured: boolean;
  missingConfiguration: AIMissingConfiguration | null;
  model: string;
};

export function getAIProviderConfig(env: Record<string, string | undefined> = process.env): AIProviderConfig {
  const selectedProvider = env.AI_PROVIDER || "openai";

  if (selectedProvider === "openai") {
    const isConfigured = Boolean(env.OPENAI_API_KEY);
    return {
      provider: selectedProvider,
      isConfigured,
      missingConfiguration: isConfigured ? null : "OPENAI_API_KEY",
      model: env.OPENAI_MODEL || "gpt-5-mini",
    };
  }

  if (selectedProvider === "gemini") {
    const isConfigured = Boolean(env.GEMINI_API_KEY);
    return {
      provider: selectedProvider,
      isConfigured,
      missingConfiguration: isConfigured ? null : "GEMINI_API_KEY",
      model: env.GEMINI_MODEL || "gemini-3.8-flash",
    };
  }

  if (selectedProvider === "openrouter") {
    const missingConfiguration = !env.OPENROUTER_API_KEY
      ? "OPENROUTER_API_KEY"
      : !env.OPENROUTER_MODEL
        ? "OPENROUTER_MODEL"
        : null;

    return {
      provider: selectedProvider,
      isConfigured: missingConfiguration === null,
      missingConfiguration,
      model: env.OPENROUTER_MODEL ?? "",
    };
  }

  throw new Error("AI_PROVIDER deve ser 'openai', 'gemini' ou 'openrouter'.");
}
