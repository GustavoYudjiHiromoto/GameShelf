"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSynopsisService } from "@/lib/ai";
import { getAIProviderConfig } from "@/lib/ai/provider-config";
import { classifySynopsisError } from "@/lib/ai/synopsis-error";
import { parseGameForm } from "@/lib/games/game-input";
import { createGame, deleteGame, getGame, isGameNotFound, updateGame } from "@/lib/games/repository";
import { addGameNavigationQuery, getGameNavigationContext } from "@/lib/games/collection-navigation";

function readNavigationContext(formData: FormData) {
  return getGameNavigationContext({
    view: String(formData.get("view") ?? "library"),
    collection: String(formData.get("collection") ?? ""),
  });
}

export async function createGameAction(formData: FormData) {
  const context = readNavigationContext(formData);
  const parsed = parseGameForm(formData);
  if (!parsed.success) redirect(addGameNavigationQuery("/games/new", context, { erro: "campos" }));

  const game = await createGame(parsed.data);
  revalidatePath("/");
  redirect(addGameNavigationQuery(`/games/${game.id}`, context));
}

export async function updateGameAction(id: string, formData: FormData) {
  const context = readNavigationContext(formData);
  const parsed = parseGameForm(formData);
  if (!parsed.success) redirect(addGameNavigationQuery(`/games/${id}/edit`, context, { erro: "campos" }));

  try {
    await updateGame(id, parsed.data);
  } catch (error) {
    if (isGameNotFound(error)) redirect(addGameNavigationQuery(context.breadcrumbHref, context, { erro: "nao-encontrado" }));
    throw error;
  }

  revalidatePath("/");
  revalidatePath(`/games/${id}`);
  if (context.collectionId) revalidatePath(context.breadcrumbHref);
  redirect(addGameNavigationQuery(`/games/${id}`, context));
}

export async function deleteGameAction(formData: FormData) {
  const context = readNavigationContext(formData);
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(addGameNavigationQuery(context.breadcrumbHref, context, { erro: "nao-encontrado" }));

  try {
    await deleteGame(id);
  } catch (error) {
    if (isGameNotFound(error)) redirect(addGameNavigationQuery(context.breadcrumbHref, context, { erro: "nao-encontrado" }));
    throw error;
  }

  revalidatePath("/");
  if (context.collectionId) revalidatePath(context.breadcrumbHref);
  redirect(addGameNavigationQuery(context.breadcrumbHref, context, { removido: "1" }));
}

export async function generateSynopsisAction(formData: FormData) {
  const context = readNavigationContext(formData);
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(context.breadcrumbHref);

  let aiConfig;
  try {
    aiConfig = getAIProviderConfig();
  } catch (error) {
    const category = classifySynopsisError(error);
    redirect(addGameNavigationQuery(`/games/${id}`, context, { sinopse: "erro", tipo: category }));
  }

  if (!aiConfig.isConfigured) {
    redirect(addGameNavigationQuery(`/games/${id}`, context, { sinopse: "configure-chave", provider: aiConfig.provider }));
  }

  const game = await getGame(id);
  if (!game) redirect(addGameNavigationQuery(context.breadcrumbHref, context, { erro: "nao-encontrado" }));

  try {
    const synopsis = await getSynopsisService().generate(game);
    await updateSynopsis(id, synopsis);
  } catch (error) {
    const category = classifySynopsisError(error);
    redirect(addGameNavigationQuery(`/games/${id}`, context, { sinopse: "erro", tipo: category }));
  }

  revalidatePath(`/games/${id}`);
  revalidatePath("/");
  if (context.collectionId) revalidatePath(context.breadcrumbHref);
  redirect(addGameNavigationQuery(`/games/${id}`, context, { sinopse: "gerada" }));
}

async function updateSynopsis(id: string, synopsis: string) {
  const { db } = await import("@/lib/db");
  await db.game.update({
    where: { id },
    data: { synopsis, synopsisGeneratedAt: new Date() },
  });
}
