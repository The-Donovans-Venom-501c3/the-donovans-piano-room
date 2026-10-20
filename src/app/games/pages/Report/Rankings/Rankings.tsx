import "./Rankings.scss";
import RankingsNavigation from "./RankingsNavigation/RankingsNavigation";
import RankingsContent from "./RankingsContent/RankingsContent";

export default function Rankings() {
  return (
    <section className="rankings-block">
      <h3 className="rankings-heading font-roboto">Your rankings</h3>
      {/* Rankings Date Pagination */}
      <RankingsNavigation />

      <RankingsContent />
    </section>
  );
}
