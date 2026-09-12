import type { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import Navbar4Left from "@/components/navbars/Navbar4Left";
import { nav4leftLinks } from "@/utils/stores";
import "./GameShell.scss";

export default function GameShell({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <div className="games-shell">
        <div className="games-shell__nav">
          <Navbar4Left openedLink={nav4leftLinks.games} />
        </div>
        <main className="games-shell__main">
          <section className="games-shell__stage">
            <div className="games-shell__curtain games-shell__curtain--left" />
            <div className="games-shell__curtain games-shell__curtain--right" />
            <div className="games-shell__spotlight" />
            <div className="games-shell__content">{children}</div>
          </section>
        </main>
      </div>
    </JotaiProvider>
  );
}
