import "server-only";
import { createSynopsisService } from "@/lib/ai/synopsis-provider";
import { createOpenAISynopsisProvider } from "@/lib/ai/openai-synopsis-provider";
import { createGeminiSynopsisProvider } from "@/lib/ai/gemini-synopsis-provider";
import { createOpenRouterSynopsisProvider } from "@/lib/ai/openrouter-synopsis-provider";
import { getAIProviderConfig } from "@/lib/ai/provider-config";

export function getSynopsisService() {
  const { provider } = getAIProviderConfig();
  const synopsisProvider = provider === "openai"
    ? createOpenAISynopsisProvider()
    : provider === "gemini"
      ? createGeminiSynopsisProvider()
      : createOpenRouterSynopsisProvider();

  return createSynopsisService(synopsisProvider);
}
