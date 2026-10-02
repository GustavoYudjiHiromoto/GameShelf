const coverPalettes = ["cover-coral", "cover-indigo", "cover-mint", "cover-gold", "cover-blue"];

export function GameCover({ title, platform, large = false }: { title: string; platform: string; large?: boolean }) {
  const initial = title.trim().charAt(0).toLocaleUpperCase("pt-BR") || "G";
  const palette = coverPalettes[title.charCodeAt(0) % coverPalettes.length];

  return (
    <div className={`game-cover ${palette}${large ? " game-cover-large" : ""}`} aria-label={`Capa ilustrativa de ${title}`} role="img">
      <span className="cover-mark">{initial}</span>
      <span className="cover-platform">{platform}</span>
      <span className="cover-spark cover-spark-one" />
      <span className="cover-spark cover-spark-two" />
    </div>
  );
}
