import { removeGameFromCollectionAction } from "@/app/collections/actions";
import { SubmitButton } from "@/components/submit-button";

export function RemoveGameFromCollectionForm({ collectionId, gameId }: { collectionId: string; gameId: string }) {
  const action = removeGameFromCollectionAction.bind(null, collectionId, gameId);

  return (
    <form action={action}>
      <SubmitButton className="button button-quiet" pendingLabel="Removendo…">Remover</SubmitButton>
    </form>
  );
}
