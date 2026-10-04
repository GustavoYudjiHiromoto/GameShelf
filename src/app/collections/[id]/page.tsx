import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CollectionGameItem } from "@/components/collection-game-item";
import { DeleteCollectionForm } from "@/components/delete-collection-form";
import { getCollection } from "@/lib/collections/repository";

export default async function CollectionDetailsPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ removida?: string; erro?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const collection = await getCollection(id);
  if (!collection) notFound();

  return (
    <AppShell active="customCollections">
      <header className="topbar"><div className="breadcrumbs"><Link href="/collections">Coleções</Link><span className="crumb-slash">/</span><strong>{collection.name}</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="page-content">
        <Link className="back-link" href="/collections">← Voltar às coleções</Link>
        <section className="collection-detail-heading">
          <div><p className="eyebrow eyebrow-compact"><span className="eyebrow-line" /> COLEÇÃO PERSONALIZADA</p><h1>{collection.name}</h1><p>{collection._count.games} {collection._count.games === 1 ? "jogo" : "jogos"}</p></div>
          <div className="detail-actions"><Link className="button button-quiet" href={`/collections/${id}/edit`}>Editar nome</Link><DeleteCollectionForm id={id} name={collection.name} /></div>
        </section>
        {query.removida === "1" && <p className="notice notice-success" role="status">Jogo removido da coleção.</p>}
        {query.erro === "nao-encontrado" && <p className="notice notice-error" role="alert">O jogo solicitado não foi encontrado.</p>}
        {collection.games.length === 0 ? (
          <section className="empty-state"><span className="empty-mark">▧</span><h2>Esta coleção está vazia</h2><p>Abra os detalhes de um jogo e marque esta coleção para adicioná-lo.</p><Link className="button button-primary" href="/">Ver minha biblioteca</Link></section>
        ) : (
          <section className="collection-game-list" aria-label={`Jogos em ${collection.name}`}>
            {collection.games.map((game) => <CollectionGameItem game={game} collectionId={id} key={game.id} />)}
          </section>
        )}
        <footer className="page-footer"><span>Remover um jogo daqui não o apaga da biblioteca.</span><span>GAMESHELF <b>·</b> 2026</span></footer>
      </div>
    </AppShell>
  );
}
