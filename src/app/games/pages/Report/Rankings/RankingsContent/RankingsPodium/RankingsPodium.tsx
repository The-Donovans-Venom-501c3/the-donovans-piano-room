import { useState } from "react";
import "./RankingsPodium.scss";
import PodiumCard from "./PodiumCard/PodiumCard";
import type { RankingsTab } from "../RankingsContent";
import type { SelectGameHandler } from "@/app/games/types";

const NoteIdentification = "/games/NoteIdentification.png";
const ScaleIdentification = "/games/ScaleIdentification.png";
const VirtualInstrument = "/games/VirtualInstrument.png";
const MajorMinor = "/games/MajorMinor.png";
const LedgerLine = "/games/Ledgerline.png";
const KeySignature = "/games/Key Signature.png";
const IntervalIdentification = "/games/Interval identification.png";
const ChordIdentification = "/games/ChordIdentification.png";

const downArrowIcon = "/games/purpleDownArrow.svg";
const upArrowIcon = "/games/purpleUpArrow.svg";

interface RankingsPodiumProps {
  activeTab: RankingsTab;
  onSelectGame: SelectGameHandler;
}

export default function RankingsPodium({ activeTab, onSelectGame }: RankingsPodiumProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {isExpanded && (
        <button
          type="button"
          className="more-rankings hide"
          aria-expanded={true}
          onClick={() => setIsExpanded(false)}
        >
          <span className="more-rankings-label">
            Hide more rankings
          </span>
          <img src={upArrowIcon} alt="" className="more-rankings-icon" />
        </button>
      )}

      <ol className={`podium-cards ${activeTab}`} role="list">
        {!isExpanded && (
          <>
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
              gameKey="note"
              gameTitle="Note Identification Game"
              gameIcon={NoteIdentification}
              gameName="Note identification"
              playCount={20}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={3}
              gameKey="math"
              gameTitle="Music x Math Game"
              gameIcon={VirtualInstrument}
              gameName="Music x Math"
              playCount={17}
              onSelectGame={onSelectGame}
            />
          </>
        )}

        {isExpanded && (
          <>
            <PodiumCard
              rank={4}
              gameKey="major-minor"
              gameTitle="Major-minor Identification Game"
              gameIcon={MajorMinor}
              gameName="Major-minor identification"
              playCount={16}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={5}
              gameKey="reading"
              gameTitle="Music is Reading Game"
              gameIcon={VirtualInstrument}
              gameName="Music is Reading"
              playCount={15}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={6}
              gameKey="interval"
              gameTitle="Interval Identification Game"
              gameIcon={IntervalIdentification}
              gameName="Interval identification"
              playCount={14}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={7}
              gameKey="ledger"
              gameTitle="Ledger Line Addition Game"
              gameIcon={LedgerLine}
              gameName="Ledger line addition"
              playCount={13}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={8}
              gameKey="key"
              gameTitle="Key Signature Identification Game"
              gameIcon={KeySignature}
              gameName="Key signature identification"
              playCount={12}
              onSelectGame={onSelectGame}
            />
            <PodiumCard
              rank={9}
              gameKey="chord"
              gameTitle="Chord Identification Game"
              gameIcon={ChordIdentification}
              gameName="Chord identification"
              playCount={11}
              onSelectGame={onSelectGame}
            />
          </>
        )}
      </ol>

      {!isExpanded && (
        <button
          type="button"
          className="more-rankings show"
          aria-expanded={false}
          onClick={() => setIsExpanded(true)}
        >
          <span className="more-rankings-label">
            Show more rankings
          </span>
          <img src={downArrowIcon} alt="" className="more-rankings-icon" />
        </button>
      )}
    </>
  );
}