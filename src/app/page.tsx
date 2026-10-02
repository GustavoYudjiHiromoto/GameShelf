import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { GameCard } from "@/components/game-card";
import { GAME_STATUSES, gameStatusLabels } from "@/lib/games/game-input";
import { getGameFilterOptions, getGameStats, listGames } from "@/lib/games/repository";

type SearchParams = Promise<{ q?: string; platform?: string; genre?: string; status?: string; removido?: string; erro?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters = {
    query: params.q,
    platform: params.platform,
    genre: params.genre,
    status: GAME_STATUSES.find((status) => status === params.status),
  };
  const [games, stats, options] = await Promise.all([listGames(filters), getGameStats(), getGameFilterOptions()]);
  const hasFilters = Boolean(params.q || params.platform || params.genre || params.status);

  return (
    <AppShell active={params.status === "BACKLOG" ? "collection" : "library"}>
      <header className="topbar">
        <div className="breadcrumbs"><span>Biblioteca</span><span className="crumb-slash">/</span><strong>Visão geral</strong></div>
        <div className="topbar-right"><span className="local-badge"><span /> Modo local</span><span className="topbar-avatar">G</span></div>
      </header>

      <div className="page-content">
        <section className="welcome-row">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> SUA ESTANTE, DO SEU JEITO</p>
            <h1>Seus jogos,<br /><span>suas histórias.</span></h1>
            <p className="welcome-copy">Tudo o que você joga, jogou ou ainda vai descobrir — em um só lugar.</p>
          </div>
          <div className="shelf-illustration" aria-hidden="true"><span className="shelf-disc disc-one" /><span className="shelf-disc disc-two" /><span className="shelf-card">GS<span>✦</span></span><span className="shelf-star">✳</span></div>
        </section>

        {params.removido && <div className="notice notice-success" role="status">Jogo removido da sua biblioteca.</div>}
        {params.erro && <div className="notice notice-error" role="alert">Não foi possível encontrar esse jogo. Atualize a página e tente novamente.</div>}

        <section className="stats-grid" aria-label="Resumo da biblioteca">
          <div className="stat-card stat-total"><span className="stat-icon">▦</span><span className="stat-label">Na sua estante</span><strong>{stats.total.toString().padStart(2, "0")}</strong><small>jogos no total</small></div>
          <div className="stat-card"><span className="stat-icon stat-icon-green">◉</span><span className="stat-label">Em andamento</span><strong>{stats.playing.toString().padStart(2, "0")}</strong><small>boas aventuras</small></div>
          <div className="stat-card"><span className="stat-icon stat-icon-gold">✦</span><span className="stat-label">Finalizados</span><strong>{stats.completed.toString().padStart(2, "0")}</strong><small>histórias vividas</small></div>
        </section>

        <section className="collection-section">
          <div className="section-heading">
            <div><p className="eyebrow eyebrow-compact">SUA COLEÇÃO</p><h2>{hasFilters ? "Resultados" : "Todos os jogos"}<span className="count-badge">{games.length}</span></h2></div>
            <Link className="button button-primary" href="/games/new"><span className="button-plus">＋</span> Adicionar jogo</Link>
          </div>

          <form className="filter-bar" action="/" method="get">
            <label className="search-box"><span className="search-icon" aria-hidden="true">⌕</span><span className="sr-only">Buscar jogo</span><input name="q" defaultValue={params.q} placeholder="Buscar na sua biblioteca…" /></label>
            <label className="filter-select"><span className="sr-only">Filtrar por plataforma</span><select name="platform" defaultValue={params.platform ?? ""}><option value="">Plataforma</option>{options.platforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label>
            <label className="filter-select"><span className="sr-only">Filtrar por gênero</span><select name="genre" defaultValue={params.genre ?? ""}><option value="">Gênero</option>{options.genres.map((genre) => <option key={genre}>{genre}</option>)}</select></label>
            <label className="filter-select"><span className="sr-only">Filtrar por status</span><select name="status" defaultValue={params.status ?? ""}><option value="">Status</option>{GAME_STATUSES.map((status) => <option key={status} value={status}>{gameStatusLabels[status]}</option>)}</select></label>
            <button className="filter-submit" type="submit">Filtrar</button>
            {hasFilters && <Link className="clear-filters" href="/">Limpar</Link>}
          </form>

          {games.length > 0 ? (
            <div className="game-grid">{games.map((game) => <GameCard key={game.id} game={game} />)}</div>
          ) : (
            <div className="empty-state">
              <div className="empty-mark">✳</div>
              <h3>{hasFilters ? "Nenhum jogo por aqui" : "Sua estante está esperando"}</h3>
              <p>{hasFilters ? "Tente mudar os filtros ou buscar por outro título." : "Adicione seu primeiro jogo e comece a montar sua biblioteca pessoal."}</p>
              {hasFilters ? <Link className="button button-quiet" href="/">Limpar filtros</Link> : <Link className="button button-primary" href="/games/new">＋ Adicionar primeiro jogo</Link>}
            </div>
          )}
        </section>
        <footer className="page-footer"><span>Feito para guardar o que você jogou.</span><span>GAMESHELF <b>·</b> 2026</span></footer>
      </div>
    </AppShell>
  );
}
