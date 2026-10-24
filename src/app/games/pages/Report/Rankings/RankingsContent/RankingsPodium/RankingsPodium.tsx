import { useEffect, useRef, useState } from "react";
import "./RankingsPodium.scss";
import PodiumCard from "./PodiumCard/PodiumCard";
import type { RankingsTab } from "../RankingsContent";
import type {
  SelectGameHandler,
  GameType,
  Level,
  LevelKey
} from "@/app/games/types";
import {
  playCountsAtom,
  fastestTimesAtom,
  highScoresAtom
} from "@/utils/stores";
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

const levels: Level[] = ["easy", "medium", "hard"];

const levelLabels: Record<Level, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

// Seconds as minutes and seconds, e.g. 95 → "1:35"
const formatTime = (totalSeconds: number) =>
  `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;

interface RankingsPodiumProps {
  activeTab: RankingsTab;
  onSelectGame: SelectGameHandler;
}

export default function RankingsPodium({ activeTab, onSelectGame }: RankingsPodiumProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const playCounts = useAtomValue(playCountsAtom);
  const fastestTimes = useAtomValue(fastestTimesAtom);
  const highScores = useAtomValue(highScoresAtom);
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

  // The game's fastest time across its levels, and which level it was on
  const getFastestRun = (gameKey: GameType) => {
    let fastest: { time: number; level: Level } | undefined;

    for (const level of levels) {
      const key: LevelKey = `${gameKey}:${level}`;
      const time = fastestTimes[key];
      if (time !== undefined && (fastest === undefined || time < fastest.time)) {
        fastest = { time, level };
      }
    }

    return fastest;
  };

  // The game's best score across its levels, plus the level and how long that run took
  const getBestRun = (gameKey: GameType) => {
    let best: { score: number; level: Level; timeSeconds: number } | undefined;

    for (const level of levels) {
      const key: LevelKey = `${gameKey}:${level}`;
      const highScore = highScores[key];
      if (highScore && (best === undefined || highScore.score >= best.score)) {
        best = { score: highScore.score, level, timeSeconds: highScore.timeSeconds };
      }
    }

    return best;
  };

  const getRankingValue = (gameKey: GameType): number | undefined => {
    switch (activeTab) {
      case "most-played":
        return playCounts[gameKey];
      case "best-score":
        return getBestRun(gameKey)?.score;
      case "fastest-time":
        return getFastestRun(gameKey)?.time;
    }
  };

  const lowerIsBetter = activeTab === "fastest-time";

  // Orders two games whose ranking values are equal. On Best score, the run
  // on the harder level wins, then the faster run; on the other tabs they stay
  // tied. Negative puts `a` first, 0 means still tied
  const compareTies = (a: GameType, b: GameType) => {
    if (activeTab !== "best-score") return 0;

    const runA = getBestRun(a);
    const runB = getBestRun(b);
    if (!runA || !runB) return 0;

    return (
      levels.indexOf(runB.level) - levels.indexOf(runA.level) ||
      runA.timeSeconds - runB.timeSeconds
    );
  };

  const formatStat = (rankingValue: number, gameKey: GameType) => {
    switch (activeTab) {
      case "most-played":
        return `${rankingValue} time${rankingValue === 1 ? "" : "s"} played`;
      case "best-score": {
        // TODO: ask UX how this tab should handle levels; the level label is a stopgap
        const run = getBestRun(gameKey);
        const details = run ? ` (${levelLabels[run.level]}, ${formatTime(run.timeSeconds)})` : "";
        return `Best score: ${rankingValue}/100${details}`;
      }
      case "fastest-time": {
        // TODO: ask UX how this tab should handle levels; the level label is a stopgap
        const level = getFastestRun(gameKey)?.level;
        return `Fastest: ${formatTime(rankingValue)}${level ? ` (${levelLabels[level]})` : ""}`;
      }
    }
  };

  const sortedGames = games
    .flatMap((game) => {
      const rankingValue = getRankingValue(game.gameKey);
      return rankingValue === undefined
        ? []
        : [{ ...game, rankingValue }];
    })
    .sort(
      (a, b) =>
        (lowerIsBetter ? a.rankingValue - b.rankingValue : b.rankingValue - a.rankingValue)
        ||
        compareTies(a.gameKey, b.gameKey)
        ||
        a.gameName.localeCompare(b.gameName)
    );

  const rankedGames = sortedGames.map((game) => ({
    ...game,
    rank: sortedGames.findIndex(
      (other) =>
        other.rankingValue === game.rankingValue &&
        compareTies(other.gameKey, game.gameKey) === 0
    ) + 1,
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
                stat={formatStat(game.rankingValue, game.gameKey)}
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
                stat={formatStat(game.rankingValue, game.gameKey)}
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