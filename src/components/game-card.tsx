import Link from "next/link";
import type { Game } from "@prisma/client";
import { gameStatusLabels, GAME_STATUSES } from "@/lib/games/game-input";
import { GameCover } from "@/components/game-cover";

export function GameCard({ game }: { game: Game }) {
  const status = GAME_STATUSES.find((value) => value === game.status) ?? "BACKLOG";

  return (
    <Link className="game-card" href={`/games/${game.id}`}>
      <GameCover title={game.title} platform={game.platform} />
      <div className="card-body">
        <div className="card-title-row">
          <h3>{game.title}</h3>
          {game.rating !== null && <span className="rating"><span>★</span> {game.rating.toLocaleString("pt-BR")}</span>}
        </div>
        <p className="card-meta">{game.genre}<span className="meta-dot">·</span>{game.platform}</p>
        <div className="card-bottom">
          <span className={`status-pill status-${status.toLowerCase().replaceAll("_", "-")}`}><span />{gameStatusLabels[status]}</span>
          <span className="card-open" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
}
