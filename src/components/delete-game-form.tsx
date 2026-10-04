"use client";

import { deleteGameAction } from "@/app/games/actions";
import type { GameNavigationView } from "@/lib/games/collection-navigation";

export function DeleteGameForm({ id, view = "library", collectionId }: { id: string; view?: GameNavigationView; collectionId?: string | null }) {
  return (
    <form action={deleteGameAction} onSubmit={(event) => {
      if (!window.confirm("Remover este jogo da sua biblioteca?")) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="view" value={view} />
      {collectionId && <input type="hidden" name="collection" value={collectionId} />}
      <button className="button button-danger-quiet" type="submit">Remover</button>
    </form>
  );
}
