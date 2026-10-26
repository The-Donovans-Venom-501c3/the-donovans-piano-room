import type { OptionClickHandler } from '../../../../types';
import { Draggable } from './Draggable';
import './ReadingOptions.scss';

const notes = ["C", "D", "E", "F", "G", "A", "B"];

interface ReadingOptionsProps {
    handleOptionClick: OptionClickHandler;
    wrongOptions?: string[];
    // Set from a correct pick until the next question loads
    correctOption?: string | null;
    // Answers aren't accepted right now (question answered or Wrong popover up), so the letters can't be dragged
    locked?: boolean;
    // The letters in the blanks, e.g. "a,f,e", or null until every blank has one
    answer?: string | null;
    // Whether any blank has a letter, so there's something to clear
    hasLetters?: boolean;
    // Empties every blank (optional: the old QuizSection screen doesn't keep its blanks here)
    onClear?: () => void;
}

// Letters the player drags onto the blanks in the sentence, and the Check button that submits them.
// The DndContext that connects the letters to the blanks lives in Home, around both.
export default function ReadingOptions({
    handleOptionClick,
    wrongOptions = [],
    correctOption = null,
    locked = false,
    answer = null,
    hasLetters = false,
    onClear,
}: ReadingOptionsProps) {
    const draggables = notes.map((note) => (
        <Draggable
            key={note}
            id={`draggable-${note}`}
            className="option-btn small-btn reading-letter"
            disabled={locked}
        >
            {note}
        </Draggable>
    ));

    // Like the other games' buttons: an answer already tried stays red and can't be sent again,
    // and the right one turns green
    const isWrong = !!answer && wrongOptions.includes(answer);
    const isCorrect = !!answer && answer === correctOption;

    return (
        <>
            <div className="small-btn-wrapper">
                {draggables}
            </div>
            {/* Like ScaleOptions: a second, 2-column row of large buttons under the letters */}
            <div className="large-btn-wrapper reading">
                <button
                    className="option-btn large-btn reading-action"
                    onClick={onClear}
                    disabled={locked || !hasLetters}
                >
                    Clear
                </button>
                <button
                    className={`option-btn large-btn reading-action${isWrong ? " wrong" : isCorrect ? " correct" : ""}`}
                    onClick={() => answer && handleOptionClick(answer)}
                    disabled={locked || !answer || isWrong}
                >
                    Check
                </button>
            </div>
        </>
    );
}
