"use client";

import { deleteGameAction } from "@/app/games/actions";

export function DeleteGameForm({ id }: { id: string }) {
  return (
    <form action={deleteGameAction} onSubmit={(event) => {
      if (!window.confirm("Remover este jogo da sua biblioteca?")) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button className="button button-danger-quiet" type="submit">Remover</button>
    </form>
  );
}
