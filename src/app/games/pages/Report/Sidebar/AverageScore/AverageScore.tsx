import "./AverageScore.scss";
// import InfoButton from "../InfoButton/InfoButton";
import { useAtomValue } from "jotai";
import { scoreSummaryAtom } from "@/utils/stores";

interface AverageScoreProps {
  isHelpOpen: boolean;
  onOpenHelp: (opener: HTMLElement) => void;
}

export default function AverageScore({
  isHelpOpen,
  onOpenHelp
}: AverageScoreProps) {
  const { total, count } = useAtomValue(scoreSummaryAtom);
  const average = count > 0 ? Math.round(total / count) : undefined;

  return (
    <section className="score-block">
      <h3 className="score-heading font-roboto">Average score</h3>
      {/* <InfoButton
        label="More info about average score"
        expanded={isHelpOpen}
        controls="help-center"
        onClick={(event) => onOpenHelp(event.currentTarget)}
      /> */}
      <p className="score font-montserrat">
        {average !== undefined ? (
          <>
            {average}
            <span className="sr-only"> out of 100</span>
          </>
        ) : (
          <>
            <span aria-hidden="true">–</span>
            <span className="sr-only">No games played yet</span>
          </>
        )}
      </p>
    </section>
  );
}
