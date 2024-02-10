import './Options.scss';
import { useAtomValue } from "jotai";
import ChordOptions from "./ChordOptions/ChordOptions";
import KeyOptions from "./KeyOptions/KeyOptions";
import NoteOptions from "./NoteOptions/NoteOptions";
import ScaleOptions from "./ScaleOptions/ScaleOptions";
import { gameStateAtom, levelStateAtom } from "../../../store/atoms";

export default function Options({ handleOptionClick }) {
  const game = useAtomValue(gameStateAtom);
  const level = useAtomValue(levelStateAtom);

  return (
    <>
      {game == "major-minor" ? (
        <ChordOptions handleOptionClick={handleOptionClick} />
      ) : game == "key" ? (
        <KeyOptions handleOptionClick={handleOptionClick} />
      ) : game == "note" ? (
        <NoteOptions handleOptionClick={handleOptionClick} level={level} />
      ) : (
        <ScaleOptions handleOptionClick={handleOptionClick} level={level} />
      )}
    </>
  );
}
