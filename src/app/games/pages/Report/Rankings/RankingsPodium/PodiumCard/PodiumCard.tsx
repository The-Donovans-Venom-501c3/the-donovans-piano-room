import "./PodiumCard.scss";

const arrowIcon = "/games/gameDashboardArrow.svg";

const placeClasses = ["first-place", "second-place", "third-place"];

const ordinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });
const ordinalSuffixes: Record<string, string> = { one: "st", two: "nd", few: "rd" };
const toOrdinal = (n: number) => `${n}${ordinalSuffixes[ordinalRules.select(n)] ?? "th"}`;

interface PodiumCardProps {
  rank: number;
  gameIcon: string;
  gameName: string;
  playCount: number;
}

export default function PodiumCard({
  rank,
  gameIcon,
  gameName,
  playCount
}: PodiumCardProps) {
  const rankLabel = `${toOrdinal(rank)}${rank <= 3 ? " place" : ""}`;

  return (
    <li className={`podium-card ${
      placeClasses[rank - 1] ?? ""
    }`}>
      <h4 className="podium-heading">
        <span className="podium-rank">{rankLabel}</span>
        <img src={gameIcon} alt="" className="game-icon" />
        <span className="game-name">{gameName}</span>
      </h4>
      <p className="game-play-count">
        {playCount} time{playCount === 1 ? "" : "s"} played
      </p>
      <button
        type="button"
        className="podium-btn"
        aria-label={`Play ${gameName} game`}
      >
        <img src={arrowIcon} alt="" className="arrow-icon" />
      </button>
    </li>
  );
}