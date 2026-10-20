import "./Highlights.scss";
import InfoButton from "../../InfoButton/InfoButton";

export default function Highlights() {
  return (
    <section className="highlights-block">
      <h3 className="highlights-heading">
        Your highlights
      </h3>
      <dl className="highlights-list">
        <dt className="highlight-label rank-label">
          <span>Rank</span>
          <InfoButton label="More info about your rank" />
        </dt>
        <dd className="highlight-value rank-value">10</dd>

        <dt className="highlight-label streak-label">
          <span>Streak</span>
          <InfoButton label="More info about your streak" />
        </dt>
        <dd className="highlight-value streak-value">2</dd>

        <dt className="highlight-label gpa-label">
          <span>GPA</span>
          <InfoButton label="More info about your GPA" />
        </dt>
        <dd className="highlight-value gpa-value">3.5</dd>

        <dt className="highlight-label coins-label">
          <span>Coins</span>
          <InfoButton label="More info about your coins" />
        </dt>
        <dd className="highlight-value coins-value">125</dd>
      </dl>
    </section>
  );
}
