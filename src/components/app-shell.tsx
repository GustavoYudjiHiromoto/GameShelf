import Link from "next/link";
import { COLLECTION_HREF } from "@/lib/games/collection-navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children, active = "library" }: { children: React.ReactNode; active?: "library" | "collection" | "customCollections" }) {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="GameShelf, início">
          <span className="brand-icon" aria-hidden="true"><span /><span /><span /><span /></span>
          <span>game<span className="brand-light">shelf</span><i>.</i></span>
        </Link>
        <div className="sidebar-section-label">BIBLIOTECA</div>
        <nav className="side-nav" aria-label="Navegação principal">
          <Link href="/?view=library" className={`nav-link ${active === "library" ? "nav-link-active" : ""}`}>
            <span className="nav-icon">▦</span><span>Visão geral</span>
          </Link>
          <Link href={COLLECTION_HREF} className={`nav-link ${active === "collection" ? "nav-link-active" : ""}`}>
            <span className="nav-icon">▤</span><span>Minha coleção</span>
          </Link>
          <Link href="/collections" className={`nav-link ${active === "customCollections" ? "nav-link-active" : ""}`}>
            <span className="nav-icon">▧</span><span>Coleções</span>
          </Link>
        </nav>
        <ThemeToggle />
        <div className="sidebar-bottom">
          <div className="sidebar-note"><span className="note-orbit">✳</span><p>Um lugar para<br /><strong>suas próximas aventuras.</strong></p></div>
          <div className="sidebar-profile"><span className="profile-avatar">G</span><span><strong>Minha estante</strong><small>Biblioteca pessoal</small></span><span className="profile-menu">···</span></div>
        </div>
      </aside>
      <main className="main-area">{children}</main>
    </div>
  );
}
