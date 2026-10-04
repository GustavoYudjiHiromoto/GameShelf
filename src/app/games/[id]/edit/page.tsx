import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { GameForm } from "@/components/game-form";
import { updateGameAction } from "@/app/games/actions";
import { getGame } from "@/lib/games/repository";
import { addGameNavigationQuery, getGameNavigationContext } from "@/lib/games/collection-navigation";

export default async function EditGamePage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; view?: string; collection?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { erro } = query;
  const game = await getGame(id);
  if (!game) notFound();
  const navigation = getGameNavigationContext(query);
  const action = updateGameAction.bind(null, id);

  return (
    <AppShell active={navigation.active}>
      <header className="topbar"><div className="breadcrumbs"><Link href={navigation.breadcrumbHref}>{navigation.breadcrumbLabel}</Link><span className="crumb-slash">/</span><Link href={addGameNavigationQuery(`/games/${id}`, navigation)}>{game.title}</Link><span className="crumb-slash">/</span><strong>Editar</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="form-page-content">
        <Link className="back-link" href={addGameNavigationQuery(`/games/${id}`, navigation)}>← Voltar aos detalhes</Link>
        <div className="form-page-heading"><p className="eyebrow"><span className="eyebrow-line" /> SUA ESTANTE, SEMPRE EM DIA</p><h1>Editar jogo</h1><p>Atualize os detalhes de <strong>{game.title}</strong>.</p></div>
        <section className="form-panel"><GameForm action={action} game={game} error={erro} view={navigation.view ?? "library"} collectionId={navigation.collectionId} /></section>
      </div>
    </AppShell>
  );
}
