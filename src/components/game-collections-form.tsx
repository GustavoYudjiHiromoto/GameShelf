import Link from "next/link";
import type { listCollections } from "@/lib/collections/repository";
import { SubmitButton } from "@/components/submit-button";

type Collections = Awaited<ReturnType<typeof listCollections>>;
type FormAction = (formData: FormData) => Promise<void>;

export function GameCollectionsForm({ collections, selectedIds, action, saved, error }: {
  collections: Collections;
  selectedIds: string[];
  action: FormAction;
  saved?: boolean;
  error?: boolean;
}) {
  return (
    <section className="detail-card game-collections-card">
      <div className="detail-card-heading">
        <div><span className="detail-card-icon notes-icon">▤</span><div><h2>Coleções</h2><p>Organize este jogo em uma ou mais coleções.</p></div></div>
      </div>
      {saved && <p className="notice notice-success" role="status">Coleções do jogo atualizadas.</p>}
      {error && <p className="form-error" role="alert">Não foi possível atualizar as coleções do jogo.</p>}
      {collections.length === 0 ? (
        <p className="synopsis-empty">Crie uma coleção para organizar este jogo. <Link href="/collections/new">Criar coleção</Link></p>
      ) : (
        <form action={action} className="game-collections-form">
          <fieldset>
            <legend className="sr-only">Selecione as coleções deste jogo</legend>
            {collections.map((collection) => (
              <label className="collection-checkbox" key={collection.id}>
                <input type="checkbox" name="collectionIds" value={collection.id} defaultChecked={selectedIds.includes(collection.id)} />
                <span>{collection.name}</span>
              </label>
            ))}
          </fieldset>
          <SubmitButton pendingLabel="Salvando…">Salvar coleções</SubmitButton>
        </form>
      )}
    </section>
  );
}
