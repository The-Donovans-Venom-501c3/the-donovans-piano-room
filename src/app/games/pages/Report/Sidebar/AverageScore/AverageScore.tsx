import "./AverageScore.scss";
import InfoButton from "../../InfoButton/InfoButton";

export default function AverageScore() {
  return (
    <section className="score-block">
      <h3 className="score-heading font-roboto">Average score</h3>
      <InfoButton label="More info about average score" />
      <p className="score font-montserrat">9.9</p>
    </section>
  );
}
