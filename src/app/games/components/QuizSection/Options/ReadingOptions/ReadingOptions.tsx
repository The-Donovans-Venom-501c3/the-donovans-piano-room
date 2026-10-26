import type { OptionClickHandler } from '../../../../types';
import { Draggable } from './Draggable';

const notes = ["C", "D", "E", "F", "G", "A", "B"];

interface ReadingOptionsProps {
    handleOptionClick: OptionClickHandler;
    wrongOptions?: string[];
    // Set from a correct pick until the next question loads
    correctOption?: string | null;
    // Answers aren't accepted right now (question answered or Wrong popover up), so the letters can't be dragged
    locked?: boolean;
}

// Letters the player drags onto the blanks in the sentence.
// The DndContext that connects them to the blanks lives in Home, around both.
export default function ReadingOptions({
    handleOptionClick: _handleOptionClick,
    wrongOptions: _wrongOptions = [],
    correctOption: _correctOption = null,
    locked = false,
}: ReadingOptionsProps) {
    const draggables = notes.map((note) => (
        <Draggable key={note} id={`draggable-${note}`} disabled={locked}>
            {note}
        </Draggable>
    ));

    return (
        <div className="small-btn-wrapper">
            {draggables}
        </div>
    );
}
