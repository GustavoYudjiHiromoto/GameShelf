import { describe, expect, it } from "vitest";
import { collectionInputSchema, normalizeCollectionName, parseCollectionForm, parseCollectionIds } from "@/lib/collections/collection-input";

describe("dados de coleção", () => {
  it("remove espaços externos e aceita nomes de coleção", () => {
    expect(collectionInputSchema.parse({ name: "  Backlog 2026  " })).toEqual({ name: "Backlog 2026" });
  });

  it("rejeita nome vazio e nomes maiores que 60 caracteres", () => {
    expect(collectionInputSchema.safeParse({ name: "   " }).success).toBe(false);
    expect(collectionInputSchema.safeParse({ name: "x".repeat(61) }).success).toBe(false);
  });

  it("normaliza o nome para impedir duplicatas que diferem por caixa", () => {
    expect(normalizeCollectionName("  Favoritos ")).toBe(normalizeCollectionName("favoritos"));
  });

  it("lê o nome enviado pelo formulário", () => {
    const form = new FormData();
    form.set("name", "RPGs");
    expect(parseCollectionForm(form)).toMatchObject({ success: true, data: { name: "RPGs" } });
  });

  it("deduplica ids de coleções enviados pelo formulário", () => {
    const form = new FormData();
    form.append("collectionIds", "collection-1");
    form.append("collectionIds", "collection-1");
    form.append("collectionIds", "collection-2");

    expect(parseCollectionIds(form)).toEqual({ success: true, data: ["collection-1", "collection-2"] });
  });
});
