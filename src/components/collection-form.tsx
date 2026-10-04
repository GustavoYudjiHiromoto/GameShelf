import type { Collection } from "@prisma/client";
import { SubmitButton } from "@/components/submit-button";

type FormAction = (formData: FormData) => Promise<void>;

export function CollectionForm({ action, collection, error }: {
  action: FormAction;
  collection?: Collection;
  error?: string;
}) {
  const errorMessage = error === "duplicada"
    ? "Já existe uma coleção com esse nome."
    : error
      ? "Não foi possível salvar a coleção. Confira o nome e tente novamente."
      : null;

  return (
    <form action={action} className="game-form">
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      <label className="field field-wide">
        <span>Nome da coleção <b>*</b></span>
        <input name="name" required maxLength={60} defaultValue={collection?.name} placeholder="Ex.: Favoritos" />
      </label>
      <div className="form-footer field-wide">
        <span className="required-note"><b>*</b> Campo obrigatório</span>
        <div className="form-buttons">
          <a className="button button-quiet" href={collection ? `/collections/${collection.id}` : "/collections"}>Cancelar</a>
          <SubmitButton pendingLabel="Salvando…">{collection ? "Salvar alterações" : "Criar coleção"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
