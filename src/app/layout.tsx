import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameShelf — sua biblioteca de jogos",
  description: "Organize sua coleção pessoal de jogos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        {children}
        <Script id="gameshelf-theme-init" strategy="beforeInteractive">
          {`try { var savedTheme = localStorage.getItem("gameshelf-theme"); var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = savedTheme === "dark" || (savedTheme !== "light" && systemPrefersDark) ? "dark" : "light"; } catch { document.documentElement.dataset.theme = "light"; }`}
        </Script>
      </body>
    </html>
  );
}
