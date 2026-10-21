import { useState } from "react";
import "./RankingsContent.scss";
import RankingsPodium from "../RankingsPodium/RankingsPodium";
import type { SelectGameHandler } from "@/app/games/types";

const tabs = [
  { key: "most-played", label: "Most played" },
  { key: "best-score", label: "Best score" },
  { key: "fastest-time", label: "Fastest time" },
] as const;

export type RankingsTab = (typeof tabs)[number]["key"];

interface RankingsContentProps {
  onSelectGame: SelectGameHandler;
}

export default function RankingsContent({ onSelectGame }: RankingsContentProps) {
  const [activeTab, setActiveTab] = useState<RankingsTab>("most-played");

  return (
    <div className="rankings-content font-roboto">
      <div className="rankings-tabs">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`${key}-tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <RankingsPodium
        key={activeTab}
        activeTab={activeTab}
        onSelectGame={onSelectGame}
      />
    </div>
  );
}
