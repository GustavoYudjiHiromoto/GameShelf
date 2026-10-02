import { describe, expect, it } from "vitest";
import { gameInputSchema, parseGameForm } from "@/lib/games/game-input";

describe("dados de jogo", () => {
  it("aceita os campos obrigatórios e uma nota dentro da escala", () => {
    const result = gameInputSchema.safeParse({
      title: "  Hollow Knight ", platform: "Nintendo Switch", genre: "Metroidvania",
      status: "PLAYING", rating: "9.5", notes: "",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Hollow Knight");
      expect(result.data.rating).toBe(9.5);
    }
  });

  it("permite nota vazia e rejeita nota fora de 0 a 10", () => {
    const base = { title: "Celeste", platform: "PC", genre: "Plataforma", status: "BACKLOG", notes: "" };
    expect(gameInputSchema.safeParse({ ...base, rating: "" }).success).toBe(true);
    expect(gameInputSchema.safeParse({ ...base, rating: "11" }).success).toBe(false);
  });

  it("lê e normaliza os dados enviados pelo formulário", () => {
    const form = new FormData();
    form.set("title", "Celeste");
    form.set("platform", "PC");
    form.set("genre", "Plataforma");
    form.set("status", "COMPLETED");
    form.set("rating", "10");
    form.set("notes", "Uma aventura marcante.");

    const result = parseGameForm(form);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("COMPLETED");
  });
});
