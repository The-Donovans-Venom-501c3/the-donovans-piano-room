import "./RankingsContent.scss";

export default function RankingsContent() {
  return (
    <div className="rankings-content">
      <div className="rankings-tabs">
        <button className="most-played-tab active">
          Most played
        </button>
        <button className="best-score-tab">
          Best score
        </button>
        <button className="fastest-time-tab">
          Fastest time
        </button>
      </div>
    </div>
  );
}
