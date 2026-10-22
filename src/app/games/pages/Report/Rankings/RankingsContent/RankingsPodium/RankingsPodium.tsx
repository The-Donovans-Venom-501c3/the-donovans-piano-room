import { useEffect, useRef, useState } from "react";
import "./RankingsPodium.scss";
import PodiumCard from "./PodiumCard/PodiumCard";
import type { RankingsTab } from "../RankingsContent";
import type { SelectGameHandler } from "@/app/games/types";
import { playCountsAtom } from "@/utils/stores";
import { useAtomValue } from "jotai";

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

// Every game that can be ranked. Play counts and ranks come from local storage
const games = [
  { gameKey: "chord", gameTitle: "Chord Identification Game", gameName: "Chord identification", gameIcon: ChordIdentification },
  { gameKey: "interval", gameTitle: "Interval Identification Game", gameName: "Interval identification", gameIcon: IntervalIdentification },
  { gameKey: "key", gameTitle: "Key Signature Identification Game", gameName: "Key signature identification", gameIcon: KeySignature },
  { gameKey: "ledger", gameTitle: "Ledger Line Addition Game", gameName: "Ledger line addition", gameIcon: LedgerLine },
  { gameKey: "major-minor", gameTitle: "Major-minor Identification Game", gameName: "Major-minor identification", gameIcon: MajorMinor },
  { gameKey: "math", gameTitle: "Music x Math Game", gameName: "Music x Math", gameIcon: VirtualInstrument },
  { gameKey: "reading", gameTitle: "Music is Reading Game", gameName: "Music is Reading", gameIcon: VirtualInstrument },
  { gameKey: "note", gameTitle: "Note Identification Game", gameName: "Note identification", gameIcon: NoteIdentification },
  { gameKey: "scale", gameTitle: "Scale Identification Game", gameName: "Scale identification", gameIcon: ScaleIdentification },
] as const;

interface RankingsPodiumProps {
  activeTab: RankingsTab;
  onSelectGame: SelectGameHandler;
}

export default function RankingsPodium({ activeTab, onSelectGame }: RankingsPodiumProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const playCounts = useAtomValue(playCountsAtom);
  const showButtonRef = useRef<HTMLButtonElement>(null);
  const hideButtonRef = useRef<HTMLButtonElement>(null);
  const hasToggled = useRef(false);

  const toggle = (expand: boolean) => {
    hasToggled.current = true;
    setIsExpanded(expand);
  };

  useEffect(() => {
    if (!hasToggled.current) return;
    (isExpanded ? hideButtonRef : showButtonRef).current?.focus();
  }, [isExpanded]);

  const sortedGames = games
    .map(
      (game) => ({ ...game, playCount: playCounts[game.gameKey] ?? 0 })
    )
    .filter(
      (game) => game.playCount > 0
    )
    .sort(
      (a, b) => b.playCount - a.playCount || a.gameName.localeCompare(b.gameName)
    );

  const rankedGames = sortedGames.map((game) => ({
    ...game,
    rank: sortedGames.findIndex((other) => other.playCount === game.playCount) + 1,
  }));

  const topThree = rankedGames.slice(0, 3);
  const theRest = rankedGames.slice(3);
  const hasMore = theRest.length > 0;

  return (
    <>
      {isExpanded && (
        <button
          type="button"
          className="more-rankings hide"
          aria-expanded={true}
          aria-controls="podium-cards"
          onClick={() => toggle(false)}
          ref={hideButtonRef}
        >
          <span className="more-rankings-label">
            Hide more rankings
          </span>
          <img src={upArrowIcon} alt="" className="more-rankings-icon" />
        </button>
      )}

      {rankedGames.length > 0 && (
        <ol
          id="podium-cards"
          className={`podium-cards ${activeTab}`}
          role="list"
        >
          {!isExpanded &&
            topThree.map((game) => (
              <PodiumCard
                key={game.gameKey}
                {...game}
                onPodium
                onSelectGame={onSelectGame}
              />
            ))
          }
          {isExpanded &&
            theRest.map((game) => (
              <PodiumCard
                key={game.gameKey}
                {...game}
                onPodium={false}
                onSelectGame={onSelectGame}
              />
            ))
          }
        </ol>
      )}
      {rankedGames.length === 0 && (
        <p className="rankings-empty">
          Play a game to see your rankings!
        </p>
      )}

      {!isExpanded && hasMore && (
        <button
          type="button"
          className="more-rankings show"
          aria-expanded={false}
          aria-controls="podium-cards"
          onClick={() => toggle(true)}
          ref={showButtonRef}
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