"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseCollectionForm, parseCollectionIds } from "@/lib/collections/collection-input";
import {
  createCollection,
  deleteCollection,
  isCollectionNameConflict,
  isCollectionNotFound,
  removeGameFromCollection,
  setGameCollections,
  updateCollection,
} from "@/lib/collections/repository";

export async function createCollectionAction(formData: FormData) {
  const parsed = parseCollectionForm(formData);
  if (!parsed.success) redirect("/collections/new?erro=campos");

  let collection;
  try {
    collection = await createCollection(parsed.data);
  } catch (error) {
    if (isCollectionNameConflict(error)) redirect("/collections/new?erro=duplicada");
    throw error;
  }

  revalidatePath("/collections");
  redirect(`/collections/${collection.id}`);
}

export async function updateCollectionAction(id: string, formData: FormData) {
  const parsed = parseCollectionForm(formData);
  if (!parsed.success) redirect(`/collections/${id}/edit?erro=campos`);

  try {
    await updateCollection(id, parsed.data);
  } catch (error) {
    if (isCollectionNameConflict(error)) redirect(`/collections/${id}/edit?erro=duplicada`);
    if (isCollectionNotFound(error)) redirect("/collections?erro=nao-encontrada");
    throw error;
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${id}`);
  redirect(`/collections/${id}`);
}

export async function deleteCollectionAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/collections?erro=nao-encontrada");

  try {
    await deleteCollection(id);
  } catch (error) {
    if (isCollectionNotFound(error)) redirect("/collections?erro=nao-encontrada");
    throw error;
  }

  revalidatePath("/collections");
  revalidatePath("/");
  redirect("/collections?removida=1");
}

export async function updateGameCollectionsAction(gameId: string, formData: FormData) {
  const parsed = parseCollectionIds(formData);
  if (!parsed.success) redirect(`/games/${gameId}?colecoes=erro`);

  try {
    await setGameCollections(gameId, parsed.data);
  } catch (error) {
    if (isCollectionNotFound(error)) redirect(`/games/${gameId}?colecoes=erro`);
    throw error;
  }

  revalidatePath(`/games/${gameId}`);
  revalidatePath("/collections");
  redirect(`/games/${gameId}?colecoes=salvas`);
}

export async function removeGameFromCollectionAction(collectionId: string, gameId: string) {
  try {
    await removeGameFromCollection(collectionId, gameId);
  } catch (error) {
    if (isCollectionNotFound(error)) redirect("/collections?erro=nao-encontrada");
    throw error;
  }

  revalidatePath(`/collections/${collectionId}`);
  revalidatePath(`/games/${gameId}`);
  revalidatePath("/collections");
  redirect(`/collections/${collectionId}`);
}
