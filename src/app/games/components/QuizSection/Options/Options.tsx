import "./Options.scss";
import type { JSX } from "react";
import { useAtomValue } from "jotai";
import MajorMinorOptions from "./MajorMinorOptions/MajorMinorOptions";
import KeyOptions from "./KeyOptions/KeyOptions";
import NoteOptions from "./NoteOptions/NoteOptions";
import ScaleOptions from "./ScaleOptions/ScaleOptions";
import IntervalOptions from "./IntervalOptions/IntervalOptions";
import ChordOptions from "./ChordOptions/ChordOptions";
import LedgerOptions from "./LedgerOptions/LedgerOptions";
import ReadingOptions from "./ReadingOptions/ReadingOptions";
import { gameStateAtom, levelStateAtom } from "@/store/game-atoms";
import { normalizeGameKey } from "../../../utils/questions";
import type { OptionClickHandler, Question, Level } from "../../../types";

interface OptionsProps {
  handleOptionClick?: OptionClickHandler;
  displayText?: string;
  currQuestion?: Question;
}

type SafeQuestion = Question & { sentence: string };

type OptionRendererProps = {
  handleClick: OptionClickHandler;
  level: Level;
  displayText: string;
  currQuestion?: SafeQuestion;
};

const OPTIONS_REGISTRY: Record<string, (props: OptionRendererProps) => JSX.Element> = {
  "major-minor": ({ handleClick }) => <MajorMinorOptions handleOptionClick={handleClick} />,
  key: ({ handleClick }) => <KeyOptions handleOptionClick={handleClick} />,
  note: ({ handleClick, level }) => <NoteOptions handleOptionClick={handleClick} level={level} />,
  scale: ({ handleClick, level }) => <ScaleOptions handleOptionClick={handleClick} level={level} />,
  chord: ({ handleClick, level }) => <ChordOptions handleOptionClick={handleClick} level={level} />,
  ledger: ({ handleClick, level }) => <LedgerOptions handleOptionClick={handleClick} level={level} />,
  interval: ({ handleClick }) => <IntervalOptions handleOptionClick={handleClick} />,
  reading: ({ displayText, currQuestion }) => (
    <ReadingOptions displayText={displayText} currQuestion={currQuestion} />
  ),
};

export default function Options({ handleOptionClick, displayText = "", currQuestion }: OptionsProps) {
  const rawGame = useAtomValue(gameStateAtom);
  const level = useAtomValue(levelStateAtom);
  const handleClick = handleOptionClick ?? (() => undefined);

  const game = normalizeGameKey(rawGame);

  const safeQuestion: SafeQuestion | undefined = currQuestion
    ? {
        ...currQuestion,
        sentence: currQuestion.sentence ?? "",
      }
    : undefined;

  const renderOptions = OPTIONS_REGISTRY[game] ?? OPTIONS_REGISTRY["reading"];

  return renderOptions({ handleClick, level, displayText, currQuestion: safeQuestion });
}