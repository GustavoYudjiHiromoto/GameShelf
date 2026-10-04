import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCollectionAction } from "@/app/collections/actions";
import { AppShell } from "@/components/app-shell";
import { CollectionForm } from "@/components/collection-form";
import { getCollection } from "@/lib/collections/repository";

export default async function EditCollectionPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const [{ id }, { erro }] = await Promise.all([params, searchParams]);
  const collection = await getCollection(id);
  if (!collection) notFound();
  return (
    <AppShell active="customCollections">
      <header className="topbar"><div className="breadcrumbs"><Link href="/collections">Coleções</Link><span className="crumb-slash">/</span><Link href={`/collections/${id}`}>{collection.name}</Link><span className="crumb-slash">/</span><strong>Editar</strong></div><span className="local-badge"><span /> Modo local</span></header>
      <div className="form-page-content">
        <Link className="back-link" href={`/collections/${id}`}>← Voltar à coleção</Link>
        <div className="form-page-heading"><p className="eyebrow"><span className="eyebrow-line" /> SUA ESTANTE, SEMPRE EM DIA</p><h1>Editar coleção</h1><p>Atualize o nome <strong>{collection.name}</strong>.</p></div>
        <section className="form-panel"><CollectionForm action={updateCollectionAction.bind(null, id)} collection={collection} error={erro} /></section>
      </div>
    </AppShell>
  );
}
