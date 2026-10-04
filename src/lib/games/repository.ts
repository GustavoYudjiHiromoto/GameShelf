import { Prisma, type Game } from "@prisma/client";
import { db } from "@/lib/db";
import type { GameInput } from "@/lib/games/game-input";

export type GameFilters = {
  query?: string;
  platform?: string;
  genre?: string;
  status?: string;
};

export async function listGames(filters: GameFilters = {}) {
  const where: Prisma.GameWhereInput = {};
  const query = filters.query?.trim();

  if (query) where.title = { contains: query };
  if (filters.platform) where.platform = filters.platform;
  if (filters.genre) where.genre = filters.genre;
  if (filters.status) where.status = filters.status;

  return db.game.findMany({ where, orderBy: [{ updatedAt: "desc" }, { title: "asc" }] });
}

export async function getGame(id: string) {
  return db.game.findUnique({ where: { id } });
}

export async function getGameWithCollections(id: string) {
  return db.game.findUnique({
    where: { id },
    include: { collections: { select: { id: true, name: true } } },
  });
}

export async function createGame(input: GameInput) {
  return db.game.create({ data: input });
}

export async function updateGame(id: string, input: GameInput) {
  return db.game.update({ where: { id }, data: input });
}

export async function deleteGame(id: string) {
  return db.game.delete({ where: { id } });
}

export async function getGameStats() {
  const [total, completed, playing] = await Promise.all([
    db.game.count(),
    db.game.count({ where: { status: "COMPLETED" } }),
    db.game.count({ where: { status: "PLAYING" } }),
  ]);

  return { total, completed, playing };
}

export async function getGameFilterOptions() {
  const [platforms, genres] = await Promise.all([
    db.game.findMany({ distinct: ["platform"], select: { platform: true }, orderBy: { platform: "asc" } }),
    db.game.findMany({ distinct: ["genre"], select: { genre: true }, orderBy: { genre: "asc" } }),
  ]);

  return { platforms: platforms.map((item) => item.platform), genres: genres.map((item) => item.genre) };
}

export function isGameNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export type GameRecord = Game;
