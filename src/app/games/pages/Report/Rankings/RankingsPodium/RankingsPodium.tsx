import "./RankingsPodium.scss";
import PodiumCard from "./PodiumCard/PodiumCard";
import type { RankingsTab } from "../RankingsContent/RankingsContent";

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
}

export default function RankingsPodium({ activeTab }: RankingsPodiumProps) {
  return (
    <ol className="podium-cards" role="list">
      <PodiumCard
        rank={1}
        gameIcon={ScaleIdentification}
        gameName="Scale identification"
        playCount={23}
      />
      <PodiumCard
        rank={2}
        gameIcon={IntervalIdentification}
        gameName="Interval identification"
        playCount={20}
      />
      <PodiumCard
        rank={3}
        gameIcon={MajorMinor}
        gameName="Major-minor identification"
        playCount={17}
      />
    </ol>
  );
}