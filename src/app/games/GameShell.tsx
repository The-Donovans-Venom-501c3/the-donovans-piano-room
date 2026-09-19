"use client";

import type { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import Navbar4Left from "@/components/navbars/Navbar4Left";
import { nav4leftLinks } from "@/utils/stores";
import "./GameShell.scss";

export default function GameShell({ children }: { children: ReactNode }) {
  return (
    <JotaiProvider>
      <div className="games-shell">
        {/* Sidebar Navigation */}
        <div className="games-shell__nav">
          <Navbar4Left openedLink={nav4leftLinks.games} />
        </div>

        {/* Main Stage Viewport Canvas */}
        <main className="games-shell__main">
          <div className="games-shell__viewport">
            {children}
          </div>
        </main>
      </div>
    </JotaiProvider>
  );
}