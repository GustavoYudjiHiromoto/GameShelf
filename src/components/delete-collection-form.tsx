"use client";

import { deleteCollectionAction } from "@/app/collections/actions";

export function DeleteCollectionForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteCollectionAction} onSubmit={(event) => {
      if (!window.confirm(`Excluir a coleção “${name}”? Os jogos serão mantidos.`)) event.preventDefault();
    }}>
      <input type="hidden" name="id" value={id} />
      <button className="button button-danger-quiet" type="submit">Excluir coleção</button>
    </form>
  );
}
