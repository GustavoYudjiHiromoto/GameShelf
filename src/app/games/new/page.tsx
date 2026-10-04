import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GameForm } from "@/components/game-form";
import { createGameAction } from "@/app/games/actions";
import { getGameNavigationContext } from "@/lib/games/collection-navigation";

export default async function NewGamePage({ searchParams }: { searchParams: Promise<{ erro?: string; view?: string }> }) {
  const query = await searchParams;
  const { erro } = query;
  const navigation = getGameNavigationContext(query);

  return (
    <AppShell active={navigation.active}>
      <header className="topbar"><div className="breadcrumbs"><Link href={navigation.breadcrumbHref}>{navigation.breadcrumbLabel}</Link><span className="crumb-slash">/</span><strong>Novo jogo</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="form-page-content">
        <Link className="back-link" href={navigation.breadcrumbHref}>← Voltar para {navigation.breadcrumbLabel.toLowerCase()}</Link>
        <div className="form-page-heading"><p className="eyebrow"><span className="eyebrow-line" /> MAIS UMA AVENTURA</p><h1>Adicionar jogo</h1><p>Guarde os detalhes para encontrar essa história quando quiser.</p></div>
        <section className="form-panel"><GameForm action={createGameAction} error={erro} view={navigation.view ?? "library"} /></section>
        <p className="form-footnote">A sinopse pode ser gerada depois, na página de detalhes do jogo.</p>
      </div>
    </AppShell>
  );
}
