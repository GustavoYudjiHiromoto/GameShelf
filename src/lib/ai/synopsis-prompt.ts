import type { GameSynopsisContext } from "@/lib/ai/synopsis-provider";

export const SYNOPSIS_INSTRUCTIONS =
  "Escreva uma sinopse curta, envolvente e factual de um jogo. Não invente detalhes específicos se não tiver certeza. Responda em português brasileiro, em um único parágrafo, sem mencionar que é uma IA.";

export function formatSynopsisContext(game: GameSynopsisContext) {
  return `Título: ${game.title}\nPlataforma: ${game.platform}\nGênero: ${game.genre}`;
}
