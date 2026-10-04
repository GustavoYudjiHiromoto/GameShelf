import Link from "next/link";
import type { Game } from "@prisma/client";
import { RemoveGameFromCollectionForm } from "@/components/remove-game-from-collection-form";
import { GAME_STATUSES, gameStatusLabels } from "@/lib/games/game-input";

export function CollectionGameItem({ game, collectionId }: { game: Game; collectionId: string }) {
  const status = GAME_STATUSES.find((value) => value === game.status) ?? "BACKLOG";
  return (
    <article className="collection-game-item">
      <Link className="collection-game-link" href={`/games/${game.id}?collection=${encodeURIComponent(collectionId)}`}>
        <strong>{game.title}</strong>
        <span>{game.platform} · {game.genre}</span>
      </Link>
      <span className={`status-pill status-${status.toLowerCase().replaceAll("_", "-")}`}><span />{gameStatusLabels[status]}</span>
      <RemoveGameFromCollectionForm collectionId={collectionId} gameId={game.id} />
    </article>
  );
}
