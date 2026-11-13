import { useRef, useState } from "react";
import "./Report.scss";
import Rankings from "./Rankings/Rankings";
import Sidebar from "./Sidebar/Sidebar";
// import HelpCenter from "./HelpCenter/HelpCenter";
import type { SelectGameHandler } from "@/app/games/types";

interface ReportProps {
  onSelectGame: SelectGameHandler;
}

export default function Report({ onSelectGame }: ReportProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpOpenerRef = useRef<HTMLElement | null>(null);

  const openHelp = (opener: HTMLElement) => {
    helpOpenerRef.current = opener;
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
    helpOpenerRef.current?.focus();
  };

  return (
    <section className="games-report-view">
      <div className="report-main">
        <h2 className="report-heading font-montserrat">
          A closer look into your achievements
        </h2>
        <p className="report-description font-roboto">
          Check your streaks, best scores, games most played, and more, and how they change over time.
        </p>

        {/* Main Report Content */}
        <Rankings onSelectGame={onSelectGame} />
      </div>

      {/* Report Averages/Highlights */}
      <Sidebar isHelpOpen={isHelpOpen} onOpenHelp={openHelp} />

      {/* Help Center Popover */}
      {/* <HelpCenter isOpen={isHelpOpen} onClose={closeHelp} /> */}
    </section>
  );
}
