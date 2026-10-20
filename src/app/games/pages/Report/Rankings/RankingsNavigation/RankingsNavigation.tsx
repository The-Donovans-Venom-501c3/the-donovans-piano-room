import "./RankingsNavigation.scss";

const prevIcon = "/games/purplePrevArrow.svg";
const nextIcon = "/games/purpleNextArrow.svg";

export default function RankingsNavigation() {
  return (
    <div
      className="rankings-navigation"
      role="group"
      aria-label="Rankings period"
    >
      <div className="rankings-select">
        <label htmlFor="rankings-period" className="sr-only">
          Period
        </label>
        <select id="rankings-period">
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="rankings-pagination">
        <button
          type="button"
          className="nav-arrow"
          aria-label="Previous week"
        >
          <img
            src={prevIcon}
            alt=""
            className="nav-icon prev"
          />
        </button>
        <span className="rankings-date-range">
          June 5 &ndash; 11, 2024
        </span>
        <button
          type="button"
          className="nav-arrow"
          aria-label="Next week"
        >
          <img
            src={nextIcon}
            alt=""
            className="nav-icon next"
          />
        </button>
      </div>
    </div>
  );
}
