import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { listCollections } from "@/lib/collections/repository";

export default async function CollectionsPage({ searchParams }: { searchParams: Promise<{ removida?: string; erro?: string }> }) {
  const [{ erro, removida }, collections] = await Promise.all([searchParams, listCollections()]);

  return (
    <AppShell active="customCollections">
      <header className="topbar"><div className="breadcrumbs"><Link href="/">Biblioteca</Link><span className="crumb-slash">/</span><strong>Coleções</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="page-content">
        <section className="section-heading collections-heading">
          <div><p className="eyebrow eyebrow-compact"><span className="eyebrow-line" /> SUA BIBLIOTECA, DO SEU JEITO</p><h1>Coleções</h1><p>Crie grupos personalizados e reúna jogos por qualquer critério.</p></div>
          <Link className="button button-primary" href="/collections/new"><span className="button-plus">＋</span> Nova coleção</Link>
        </section>
        {removida === "1" && <p className="notice notice-success" role="status">Coleção removida. Os jogos continuam na sua biblioteca.</p>}
        {erro === "nao-encontrada" && <p className="notice notice-error" role="alert">A coleção solicitada não foi encontrada.</p>}
        {collections.length === 0 ? (
          <section className="empty-state"><span className="empty-mark">▧</span><h2>Nenhuma coleção criada</h2><p>Monte grupos como Favoritos, Backlog 2026 ou jogos para jogar com amigos.</p><Link className="button button-primary" href="/collections/new">Criar primeira coleção</Link></section>
        ) : (
          <div className="collection-grid">
            {collections.map((collection) => (
              <Link className="collection-tile" href={`/collections/${collection.id}`} key={collection.id}>
                <span className="collection-tile-icon">▧</span><span className="collection-tile-copy"><strong>{collection.name}</strong><small>{collection._count.games} {collection._count.games === 1 ? "jogo" : "jogos"}</small></span><span className="card-open" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        )}
        <footer className="page-footer"><span>Os jogos podem pertencer a várias coleções.</span><span>GAMESHELF <b>·</b> 2026</span></footer>
      </div>
    </AppShell>
  );
}
