export type GameSynopsisContext = {
  title: string;
  platform: string;
  genre: string;
};

export interface SynopsisProvider {
  generate(context: GameSynopsisContext): Promise<string>;
}

export function createSynopsisService(provider: SynopsisProvider) {
  return {
    generate(context: GameSynopsisContext) {
      return provider.generate(context);
    },
  };
}
