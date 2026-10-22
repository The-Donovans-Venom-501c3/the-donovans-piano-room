import "./AverageScore.scss";
import InfoButton from "../../InfoButton/InfoButton";

interface AverageScoreProps {
  isHelpOpen: boolean;
  onOpenHelp: (opener: HTMLElement) => void;
}

export default function AverageScore({
  isHelpOpen,
  onOpenHelp
}: AverageScoreProps) {
  return (
    <section className="score-block">
      <h3 className="score-heading font-roboto">Average score</h3>
      <InfoButton
        label="More info about average score"
        expanded={isHelpOpen}
        controls="help-center"
        onClick={(event) => onOpenHelp(event.currentTarget)}
      />
      <p className="score font-montserrat">9.9</p>
    </section>
  );
}
