import { describe, expect, it } from "vitest";
import { addGameNavigationQuery, COLLECTION_HREF, getCollectionNavigation, getGameNavigationContext } from "@/lib/games/collection-navigation";

describe("navegação da coleção", () => {
  it("reconhece a visualização explícita de coleção independente do status", () => {
    expect(getCollectionNavigation({ view: "collection", status: "COMPLETED" })).toEqual({
      isCollection: true,
      active: "collection",
      heading: "Minha coleção",
      viewParam: "collection",
      clearHref: COLLECTION_HREF,
      hasClearableFilters: true,
      hasCustomFilters: true,
    });
  });

  it("mantém compatibilidade com links antigos de backlog", () => {
    expect(getCollectionNavigation({ status: "BACKLOG" }).isCollection).toBe(true);
  });

  it("limpa filtros sem sair da coleção e restaura seu status inicial", () => {
    expect(getCollectionNavigation({ view: "collection", status: "BACKLOG" })).toMatchObject({
      clearHref: COLLECTION_HREF,
      hasClearableFilters: false,
    });
    expect(getCollectionNavigation({ view: "collection", status: "BACKLOG", q: "zelda" }).hasClearableFilters).toBe(true);
  });

  it("mantém visão geral como padrão", () => {
    expect(getCollectionNavigation({})).toMatchObject({
      isCollection: false,
      active: "library",
      heading: "Visão geral",
      viewParam: "library",
      clearHref: "/?view=library",
      hasClearableFilters: false,
    });
  });

  it("não confunde um filtro de backlog na visão geral com a coleção", () => {
    expect(getCollectionNavigation({ view: "library", status: "BACKLOG" }).isCollection).toBe(false);
  });

  it("mantém contexto e breadcrumb da seção ao abrir detalhes do jogo", () => {
    expect(getGameNavigationContext({ view: "collection" })).toMatchObject({
      active: "collection",
      breadcrumbLabel: "Minha coleção",
      breadcrumbHref: COLLECTION_HREF,
    });
    expect(addGameNavigationQuery("/games/game-1", getGameNavigationContext({ view: "collection" })))
      .toBe("/games/game-1?view=collection");
  });

  it("retorna de jogos abertos dentro de uma coleção personalizada para ela", () => {
    const context = getGameNavigationContext({ collection: "collection-1" });
    expect(context).toMatchObject({ active: "customCollections", breadcrumbLabel: "Coleções" });
    expect(addGameNavigationQuery("/games/game-1", context)).toBe("/games/game-1?collection=collection-1");
  });

  it("ignora identificadores de coleção inválidos no contexto de navegação", () => {
    expect(getGameNavigationContext({ collection: "../outside" }).active).toBe("library");
  });
});
