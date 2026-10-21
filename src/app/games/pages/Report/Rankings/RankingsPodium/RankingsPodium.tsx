import "./RankingsPodium.scss";
import PodiumCard from "./PodiumCard/PodiumCard";
import type { RankingsTab } from "../RankingsContent/RankingsContent";
import type { SelectGameHandler } from "@/app/games/types";

// const NoteIdentification = "/games/NoteIdentification.png";
const ScaleIdentification = "/games/ScaleIdentification.png";
// const VirtualInstrument = "/games/VirtualInstrument.png";
const MajorMinor = "/games/MajorMinor.png";
// const LedgerLine = "/games/Ledgerline.png";
// const KeySignature = "/games/Key Signature.png";
const IntervalIdentification = "/games/Interval identification.png";
// const ChordIdentification = "/games/ChordIdentification.png";

const downArrowIcon = "/games/purpleDownArrow.svg";

interface RankingsPodiumProps {
  activeTab: RankingsTab;
  onSelectGame: SelectGameHandler;
}

export default function RankingsPodium({ activeTab, onSelectGame }: RankingsPodiumProps) {
  return (
    <ol className={`podium-cards ${activeTab}`} role="list">
      <PodiumCard
        rank={1}
        gameKey="scale"
        gameTitle="Scale Identification Game"
        gameIcon={ScaleIdentification}
        gameName="Scale identification"
        playCount={23}
        onSelectGame={onSelectGame}
      />
      <PodiumCard
        rank={2}
        gameKey="interval"
        gameTitle="Interval Identification Game"
        gameIcon={IntervalIdentification}
        gameName="Interval identification"
        playCount={20}
        onSelectGame={onSelectGame}
      />
      <PodiumCard
        rank={3}
        gameKey="major-minor"
        gameTitle="Major-minor Identification Game"
        gameIcon={MajorMinor}
        gameName="Major-minor identification"
        playCount={17}
        onSelectGame={onSelectGame}
      />
    </ol>
  );
}