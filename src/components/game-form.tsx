import type { Game } from "@prisma/client";
import { GAME_STATUSES, gameStatusLabels } from "@/lib/games/game-input";
import { SubmitButton } from "@/components/submit-button";

type FormAction = (formData: FormData) => Promise<void>;

export function GameForm({ action, game, error }: { action: FormAction; game?: Game; error?: string }) {
  return (
    <form action={action} className="game-form">
      {error && <p className="form-error" role="alert">Não foi possível salvar. Revise os campos e tente novamente.</p>}

      <label className="field field-wide">
        <span>Título <b>*</b></span>
        <input name="title" required maxLength={120} defaultValue={game?.title} placeholder="Ex.: Hollow Knight" />
      </label>

      <label className="field">
        <span>Plataforma <b>*</b></span>
        <input name="platform" required maxLength={80} defaultValue={game?.platform} placeholder="Ex.: Nintendo Switch" />
      </label>

      <label className="field">
        <span>Gênero <b>*</b></span>
        <input name="genre" required maxLength={80} defaultValue={game?.genre} placeholder="Ex.: Metroidvania" />
      </label>

      <label className="field">
        <span>Status</span>
        <select name="status" defaultValue={game?.status ?? "BACKLOG"}>
          {GAME_STATUSES.map((status) => <option key={status} value={status}>{gameStatusLabels[status]}</option>)}
        </select>
      </label>

      <label className="field">
        <span>Sua nota <small>opcional · de 0 a 10</small></span>
        <input name="rating" type="number" min="0" max="10" step="0.5" defaultValue={game?.rating ?? ""} placeholder="—" />
      </label>

      <label className="field field-wide">
        <span>Observações <small>opcional</small></span>
        <textarea name="notes" rows={5} maxLength={4000} defaultValue={game?.notes} placeholder="Anote suas impressões, conquistas ou o que quiser lembrar…" />
      </label>

      <div className="form-footer field-wide">
        <span className="required-note"><b>*</b> Campos obrigatórios</span>
        <div className="form-buttons">
          <a className="button button-quiet" href={game ? `/games/${game.id}` : "/"}>Cancelar</a>
          <SubmitButton pendingLabel="Salvando…">{game ? "Salvar alterações" : "Adicionar jogo"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
