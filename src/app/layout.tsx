import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameShelf — sua biblioteca de jogos",
  description: "Organize sua coleção pessoal de jogos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
