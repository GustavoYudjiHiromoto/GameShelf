"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSynopsisService } from "@/lib/ai";
import { getAIProviderConfig } from "@/lib/ai/provider-config";
import { classifySynopsisError } from "@/lib/ai/synopsis-error";
import { parseGameForm } from "@/lib/games/game-input";
import { createGame, deleteGame, getGame, isGameNotFound, updateGame } from "@/lib/games/repository";

export async function createGameAction(formData: FormData) {
  const parsed = parseGameForm(formData);
  if (!parsed.success) redirect("/games/new?erro=campos");

  const game = await createGame(parsed.data);
  revalidatePath("/");
  redirect(`/games/${game.id}`);
}

export async function updateGameAction(id: string, formData: FormData) {
  const parsed = parseGameForm(formData);
  if (!parsed.success) redirect(`/games/${id}/edit?erro=campos`);

  try {
    await updateGame(id, parsed.data);
  } catch (error) {
    if (isGameNotFound(error)) redirect("/?erro=nao-encontrado");
    throw error;
  }

  revalidatePath("/");
  revalidatePath(`/games/${id}`);
  redirect(`/games/${id}`);
}

export async function deleteGameAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/?erro=nao-encontrado");

  try {
    await deleteGame(id);
  } catch (error) {
    if (isGameNotFound(error)) redirect("/?erro=nao-encontrado");
    throw error;
  }

  revalidatePath("/");
  redirect("/?removido=1");
}

export async function generateSynopsisAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/");

  let aiConfig;
  try {
    aiConfig = getAIProviderConfig();
  } catch (error) {
    const category = classifySynopsisError(error);
    redirect(`/games/${id}?sinopse=erro&tipo=${category}`);
  }

  if (!aiConfig.isConfigured) {
    redirect(`/games/${id}?sinopse=configure-chave&provider=${aiConfig.provider}`);
  }

  const game = await getGame(id);
  if (!game) redirect("/?erro=nao-encontrado");

  try {
    const synopsis = await getSynopsisService().generate(game);
    await updateSynopsis(id, synopsis);
  } catch (error) {
    const category = classifySynopsisError(error);
    redirect(`/games/${id}?sinopse=erro&tipo=${category}`);
  }

  revalidatePath(`/games/${id}`);
  revalidatePath("/");
  redirect(`/games/${id}?sinopse=gerada`);
}

async function updateSynopsis(id: string, synopsis: string) {
  const { db } = await import("@/lib/db");
  await db.game.update({
    where: { id },
    data: { synopsis, synopsisGeneratedAt: new Date() },
  });
}
