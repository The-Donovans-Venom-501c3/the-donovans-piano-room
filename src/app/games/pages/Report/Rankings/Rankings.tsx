import "./Rankings.scss";
// import RankingsNavigation from "./RankingsNavigation/RankingsNavigation";
import RankingsContent from "./RankingsContent/RankingsContent";
import type { SelectGameHandler } from "@/app/games/types";

interface RankingsProps {
  onSelectGame: SelectGameHandler;
}

export default function Rankings({ onSelectGame }: RankingsProps) {
  return (
    <section className="rankings-block">
      <h3 className="rankings-heading font-roboto">Your rankings</h3>
      {/* Rankings Date Pagination */}
      {/* <RankingsNavigation /> */}

      <RankingsContent onSelectGame={onSelectGame} />
    </section>
  );
}
