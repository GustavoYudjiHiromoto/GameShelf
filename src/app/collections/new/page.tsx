import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CollectionForm } from "@/components/collection-form";
import { createCollectionAction } from "@/app/collections/actions";

export default async function NewCollectionPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <AppShell active="customCollections">
      <header className="topbar"><div className="breadcrumbs"><Link href="/collections">Coleções</Link><span className="crumb-slash">/</span><strong>Nova coleção</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="form-page-content">
        <Link className="back-link" href="/collections">← Voltar às coleções</Link>
        <div className="form-page-heading"><p className="eyebrow"><span className="eyebrow-line" /> ORGANIZE SUA ESTANTE</p><h1>Nova coleção</h1><p>Escolha um nome; você poderá adicionar jogos na página de cada jogo.</p></div>
        <section className="form-panel"><CollectionForm action={createCollectionAction} error={erro} /></section>
      </div>
    </AppShell>
  );
}
