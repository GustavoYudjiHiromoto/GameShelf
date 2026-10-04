import { describe, expect, it } from "vitest";
import { COLLECTION_HREF, getCollectionNavigation } from "@/lib/games/collection-navigation";

describe("navegação da coleção", () => {
  it("reconhece a visualização explícita de coleção independente do status", () => {
    expect(getCollectionNavigation({ view: "collection", status: "COMPLETED" })).toEqual({
      isCollection: true,
      active: "collection",
      heading: "Minha coleção",
      viewParam: "collection",
      clearHref: COLLECTION_HREF,
      hasClearableFilters: true,
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
});
