import { useState } from "react";
import "./RankingsContent.scss";

const tabs = [
  { key: "most-played", label: "Most played" },
  { key: "best-score", label: "Best score" },
  { key: "fastest-time", label: "Fastest time" },
] as const;

type RankingsTab = (typeof tabs)[number]["key"];

export default function RankingsContent() {
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
    </div>
  );
}
