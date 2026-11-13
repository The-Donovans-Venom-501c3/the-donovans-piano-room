import "./Sidebar.scss";
import AverageScore from "./AverageScore/AverageScore";
import Highlights from "./Highlights/Highlights";

interface SidebarProps {
  isHelpOpen: boolean;
  onOpenHelp: (opener: HTMLElement) => void;
}

export default function Sidebar({
  isHelpOpen,
  onOpenHelp
}: SidebarProps) {
  return (
    <div className="report-sidebar">
      <AverageScore
        isHelpOpen={isHelpOpen}
        onOpenHelp={onOpenHelp}
      />
      <Highlights />
    </div>
  );
}
