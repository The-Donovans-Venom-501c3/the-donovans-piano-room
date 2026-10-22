import "./PodiumCard.scss";
import type { GameType, SelectGameHandler } from "@/app/games/types";

const arrowIcon = "/games/gameDashboardArrow.svg";

const placeClasses = ["first-place", "second-place", "third-place"];

const ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });
const ordinalSuffixes: Record<string, string> = { one: "st", two: "nd", few: "rd" };
const toOrdinal = (n: number) => `${n}${ordinalSuffixes[ordinalRules.select(n)] ?? "th"}`;

interface PodiumCardProps {
  rank: number;
  onPodium: boolean;
  gameKey: GameType;
  // Passed to `onSelectGame` for the welcome screen, e.g. "Scale Identification
  // Game". Must match the title the dashboard passes for the same game
  gameTitle: string;
  gameIcon: string;
  // Shown on the card, e.g. "Scale identification"
  gameName: string;
  stat: string;
  onSelectGame: SelectGameHandler;
}

export default function PodiumCard({
  rank,
  onPodium,
  gameKey,
  gameTitle,
  gameIcon,
  gameName,
  stat,
  onSelectGame
}: PodiumCardProps) {
  const placeClass = onPodium ? placeClasses[rank - 1] : "below-podium";
  const rankLabel = `${toOrdinal(rank)}${onPodium ? " place" : ""}`;

  return (
    <li className={`podium-card ${placeClass}`}>
      <h4 className="podium-heading">
        <span className="podium-rank">{rankLabel}</span>
        <img src={gameIcon} alt="" className="game-icon" />
        <span className="game-name">{gameName}</span>
      </h4>
      <p className="game-stat">{stat}</p>
      <button
        type="button"
        className="podium-btn"
        aria-label={`Play ${gameName} game`}
        onClick={() => onSelectGame(gameKey, gameTitle)}
      >
        <img src={arrowIcon} alt="" className="arrow-icon" />
      </button>
    </li>
  );
}