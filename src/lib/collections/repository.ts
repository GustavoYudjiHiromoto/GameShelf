import { Prisma, type Collection } from "@prisma/client";
import { db } from "@/lib/db";
import { normalizeCollectionName, type CollectionInput } from "@/lib/collections/collection-input";

export async function listCollections() {
  return db.collection.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { games: true } } },
  });
}

export async function getCollection(id: string) {
  return db.collection.findUnique({
    where: { id },
    include: {
      games: { orderBy: [{ updatedAt: "desc" }, { title: "asc" }] },
      _count: { select: { games: true } },
    },
  });
}

export function createCollection(input: CollectionInput) {
  return db.collection.create({
    data: { ...input, nameKey: normalizeCollectionName(input.name) },
  });
}

export function updateCollection(id: string, input: CollectionInput) {
  return db.collection.update({
    where: { id },
    data: { ...input, nameKey: normalizeCollectionName(input.name) },
  });
}

export function deleteCollection(id: string) {
  return db.collection.delete({ where: { id } });
}

export function setGameCollections(gameId: string, collectionIds: string[]) {
  return db.game.update({
    where: { id: gameId },
    data: { collections: { set: collectionIds.map((id) => ({ id })) } },
    select: { id: true },
  });
}

export function removeGameFromCollection(collectionId: string, gameId: string) {
  return db.collection.update({
    where: { id: collectionId },
    data: { games: { disconnect: { id: gameId } } },
    select: { id: true },
  });
}

export function isCollectionNameConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export function isCollectionNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export type CollectionRecord = Collection;
