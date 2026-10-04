import { z } from "zod";

export const collectionInputSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da coleção.").max(60, "Use até 60 caracteres."),
});

export const collectionIdsSchema = z.array(z.string().min(1).max(100));

export type CollectionInput = z.infer<typeof collectionInputSchema>;

export function parseCollectionForm(formData: FormData) {
  return collectionInputSchema.safeParse({ name: formData.get("name") });
}

export function parseCollectionIds(formData: FormData) {
  const parsed = collectionIdsSchema.safeParse(formData.getAll("collectionIds"));
  if (!parsed.success) return parsed;
  return { success: true as const, data: [...new Set(parsed.data)] };
}

export function normalizeCollectionName(name: string) {
  return name.normalize("NFKC").trim().toLowerCase();
}
