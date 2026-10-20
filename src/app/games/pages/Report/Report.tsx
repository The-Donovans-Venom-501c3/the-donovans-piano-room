import "./Report.scss";
import Rankings from "./Rankings/Rankings";
import Sidebar from "./Sidebar/Sidebar";

export default function Report() {
  return (
    <section className="games-report-view">
      <div className="report-main">
        <h2 className="report-heading font-montserrat">
          A closer look into your achievements
        </h2>
        <p className="report-description font-roboto">
          Check your streaks, best scores, games most played, and more, and how they change over time.
        </p>

        {/* Main Report Content */}
        <Rankings />
      </div>

      {/* Report Averages/Highlights */}
      <Sidebar />

      {/* Help Center Popover */}
    </section>
  );
}
