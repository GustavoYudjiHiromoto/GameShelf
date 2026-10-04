import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import type { GameInput } from "@/lib/games/game-input";
import { createGame, deleteGame, getGame, listGames, updateGame } from "@/lib/games/repository";
import { createCollection, deleteCollection, getCollection, removeGameFromCollection, setGameCollections } from "@/lib/collections/repository";

const baseGame = {
  title: "Hollow Knight", platform: "Nintendo Switch", genre: "Metroidvania",
  status: "BACKLOG", rating: 9.5, notes: "Explorar Hallownest.",
} satisfies GameInput;

describe("repositório de jogos", () => {
  beforeEach(async () => {
    await db.game.deleteMany();
    await db.collection.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("cria, lê, atualiza e remove um jogo persistido", async () => {
    const created = await createGame(baseGame);
    expect((await getGame(created.id))?.title).toBe("Hollow Knight");

    await updateGame(created.id, { ...baseGame, title: "Hollow Knight: Silksong", status: "PLAYING" });
    expect((await getGame(created.id))?.status).toBe("PLAYING");

    await deleteGame(created.id);
    expect(await getGame(created.id)).toBeNull();
  });

  it("filtra por título, plataforma, gênero e status", async () => {
    await createGame(baseGame);
    await createGame({ ...baseGame, title: "Celeste", platform: "PC", genre: "Plataforma", status: "COMPLETED" });

    expect((await listGames({ query: "Hollow" })).map((game) => game.title)).toEqual(["Hollow Knight"]);
    expect((await listGames({ platform: "PC" })).map((game) => game.title)).toEqual(["Celeste"]);
    expect((await listGames({ genre: "Metroidvania" })).map((game) => game.title)).toEqual(["Hollow Knight"]);
    expect((await listGames({ status: "COMPLETED" })).map((game) => game.title)).toEqual(["Celeste"]);
  });

  it("associa um jogo a várias coleções e permite removê-lo sem apagar o jogo", async () => {
    const game = await createGame(baseGame);
    const favorites = await createCollection({ name: "Favoritos" });
    const backlog = await createCollection({ name: "Backlog 2026" });

    await setGameCollections(game.id, [favorites.id, backlog.id]);
    expect((await getCollection(favorites.id))?.games.map(({ id }) => id)).toContain(game.id);
    expect((await getCollection(backlog.id))?.games.map(({ id }) => id)).toContain(game.id);

    await removeGameFromCollection(favorites.id, game.id);
    expect((await getCollection(favorites.id))?.games).toHaveLength(0);
    expect((await getCollection(backlog.id))?.games.map(({ id }) => id)).toContain(game.id);
    expect((await getGame(game.id))?.title).toBe(baseGame.title);
  });

  it("excluir uma coleção preserva os jogos associados", async () => {
    const game = await createGame(baseGame);
    const collection = await createCollection({ name: "Para amigos" });
    await setGameCollections(game.id, [collection.id]);

    await deleteCollection(collection.id);
    expect(await getCollection(collection.id)).toBeNull();
    expect((await getGame(game.id))?.title).toBe(baseGame.title);
  });
});
