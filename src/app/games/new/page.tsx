import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GameForm } from "@/components/game-form";
import { createGameAction } from "@/app/games/actions";

export default async function NewGamePage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;

  return (
    <AppShell>
      <header className="topbar"><div className="breadcrumbs"><Link href="/">Biblioteca</Link><span className="crumb-slash">/</span><strong>Novo jogo</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="form-page-content">
        <Link className="back-link" href="/">← Voltar à biblioteca</Link>
        <div className="form-page-heading"><p className="eyebrow"><span className="eyebrow-line" /> MAIS UMA AVENTURA</p><h1>Adicionar jogo</h1><p>Guarde os detalhes para encontrar essa história quando quiser.</p></div>
        <section className="form-panel"><GameForm action={createGameAction} error={erro} /></section>
        <p className="form-footnote">A sinopse pode ser gerada depois, na página de detalhes do jogo.</p>
      </div>
    </AppShell>
  );
}
