import { z } from "zod";

export const GAME_STATUSES = [
  "BACKLOG",
  "PLAYING",
  "COMPLETED",
  "ON_HOLD",
  "DROPPED",
] as const;

export const gameStatusLabels: Record<(typeof GAME_STATUSES)[number], string> = {
  BACKLOG: "Quero jogar",
  PLAYING: "Jogando",
  COMPLETED: "Concluído",
  ON_HOLD: "Em pausa",
  DROPPED: "Abandonado",
};

const optionalRating = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .pipe(z.number().min(0, "A nota mínima é 0.").max(10, "A nota máxima é 10.").nullable());

export const gameInputSchema = z.object({
  title: z.string().trim().min(1, "Informe o título.").max(120, "Use até 120 caracteres."),
  platform: z.string().trim().min(1, "Informe a plataforma.").max(80, "Use até 80 caracteres."),
  genre: z.string().trim().min(1, "Informe o gênero.").max(80, "Use até 80 caracteres."),
  status: z.enum(GAME_STATUSES),
  rating: optionalRating,
  notes: z.string().trim().max(4000, "Use até 4.000 caracteres."),
});

export type GameInput = z.infer<typeof gameInputSchema>;

export function parseGameForm(formData: FormData) {
  return gameInputSchema.safeParse({
    title: formData.get("title"),
    platform: formData.get("platform"),
    genre: formData.get("genre"),
    status: formData.get("status"),
    rating: formData.get("rating") ?? "",
    notes: formData.get("notes") ?? "",
  });
}
