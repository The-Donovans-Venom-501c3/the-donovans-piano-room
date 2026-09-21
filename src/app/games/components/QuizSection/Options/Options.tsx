import "./Options.scss";
import { useAtomValue } from "jotai";
import MajorMinorOptions from "./MajorMinorOptions/MajorMinorOptions";
import KeyOptions from "./KeyOptions/KeyOptions";
import NoteOptions from "./NoteOptions/NoteOptions";
import ScaleOptions from "./ScaleOptions/ScaleOptions";
import { gameStateAtom, levelStateAtom } from "@/store/game-atoms";
import IntervalOptions from "./IntervalOptions/IntervalOptions";
import ChordOptions from "./ChordOptions/ChordOptions";
import LedgerOptions from "./LedgerOptions/LedgerOptions";
import ReadingOptions from "./ReadingOptions/ReadingOptions";
import type { OptionClickHandler, Question } from "../../../types";

interface OptionsProps {
  handleOptionClick?: OptionClickHandler;
  displayText?: string;
  currQuestion?: Question;
}

export default function Options({ handleOptionClick, displayText = "", currQuestion }: OptionsProps) {
  const game = useAtomValue(gameStateAtom);
  const level = useAtomValue(levelStateAtom);
  const handleClick = handleOptionClick ?? (() => undefined);

  // Normalize currQuestion so sentence is guaranteed to be a string
  const safeQuestion = currQuestion
    ? {
        ...currQuestion,
        sentence: currQuestion.sentence ?? "",
      }
    : undefined;

  return (
    <>
      {game === "major-minor" ? (
        <MajorMinorOptions handleOptionClick={handleClick} />
      ) : game === "key" ? (
        <KeyOptions handleOptionClick={handleClick} />
      ) : game === "note" ? (
        <NoteOptions handleOptionClick={handleClick} level={level} />
      ) : game === "scale" ? (
        <ScaleOptions handleOptionClick={handleClick} level={level} />
      ) : game === "chord" ? (
        <ChordOptions handleOptionClick={handleClick} level={level} />
      ) : game === "ledger" ? (
        <LedgerOptions handleOptionClick={handleClick} level={level} />
      ) : game === "interval" ? (
        <IntervalOptions handleOptionClick={handleClick} />
      ) : (
        <ReadingOptions displayText={displayText} currQuestion={safeQuestion} />
      )}
    </>
  );
}