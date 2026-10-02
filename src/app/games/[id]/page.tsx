import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DeleteGameForm } from "@/components/delete-game-form";
import { GameCover } from "@/components/game-cover";
import { SubmitButton } from "@/components/submit-button";
import { generateSynopsisAction } from "@/app/games/actions";
import { GAME_STATUSES, gameStatusLabels } from "@/lib/games/game-input";
import { getGame } from "@/lib/games/repository";

export default async function GameDetailsPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sinopse?: string; provider?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const game = await getGame(id);
  if (!game) notFound();
  const status = GAME_STATUSES.find((value) => value === game.status) ?? "BACKLOG";

  return (
    <AppShell>
      <header className="topbar"><div className="breadcrumbs"><Link href="/">Biblioteca</Link><span className="crumb-slash">/</span><strong>{game.title}</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="detail-page-content">
        <Link className="back-link" href="/">← Voltar à biblioteca</Link>
        {query.sinopse === "configure-chave" && <div className="notice notice-error" role="alert">Configure {query.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} no arquivo .env.local para gerar sinopses.</div>}
        {query.sinopse === "erro" && <div className="notice notice-error" role="alert">Não foi possível gerar a sinopse. Verifique sua chave e conexão e tente novamente.</div>}
        {query.sinopse === "gerada" && <div className="notice notice-success" role="status">Sinopse gerada e salva.</div>}

        <div className="detail-hero">
          <GameCover title={game.title} platform={game.platform} large />
          <div className="detail-heading">
            <span className={`status-pill status-${status.toLowerCase().replaceAll("_", "-")}`}><span />{gameStatusLabels[status]}</span>
            <h1>{game.title}</h1>
            <p className="detail-subtitle">{game.genre}<span>·</span>{game.platform}</p>
            {game.rating !== null && <div className="detail-rating"><span>★</span><strong>{game.rating.toLocaleString("pt-BR")}</strong><small>/ 10 · sua nota</small></div>}
            <div className="detail-actions"><Link className="button button-primary" href={`/games/${game.id}/edit`}>Editar jogo</Link><DeleteGameForm id={game.id} /></div>
          </div>
        </div>

        <div className="detail-columns">
          <section className="detail-card synopsis-card">
            <div className="detail-card-heading"><div><span className="detail-card-icon ai-icon">✳</span><div><h2>Sinopse</h2><p>Uma visão geral da sua próxima aventura.</p></div></div><span className="ai-label">GERADA POR IA</span></div>
            {game.synopsis ? <p className="synopsis-text">{game.synopsis}</p> : <p className="synopsis-empty">Ainda não há uma sinopse para este jogo.</p>}
            <form action={generateSynopsisAction} className="synopsis-form"><input type="hidden" name="id" value={game.id} /><SubmitButton className="button button-ai" pendingLabel="Preparando sinopse…">✳ {game.synopsis ? "Gerar novamente" : "Gerar sinopse"}</SubmitButton><span>A sinopse mais recente fica salva junto ao jogo.</span></form>
            {game.synopsisGeneratedAt && <p className="generated-date">Atualizada em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(game.synopsisGeneratedAt)}</p>}
          </section>

          <section className="detail-card notes-card"><div className="detail-card-heading"><div><span className="detail-card-icon notes-icon">▤</span><div><h2>Suas observações</h2><p>Notas pessoais sobre o jogo.</p></div></div></div>{game.notes ? <p className="notes-text">{game.notes}</p> : <p className="synopsis-empty">Nenhuma observação adicionada.</p>}<Link href={`/games/${game.id}/edit`} className="inline-edit">Adicionar ou editar observações <span>↗</span></Link></section>
        </div>
        <footer className="page-footer"><span>GameShelf guarda sua biblioteca neste dispositivo.</span><span>GAMESHELF <b>·</b> 2026</span></footer>
      </div>
    </AppShell>
  );
}
