import { DndContext } from '@dnd-kit/core';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';

const notes = ["C", "D", "E", "F", "G", "A", "B"];

interface ReadingOptionsProps {
    displayText?: string;
    currQuestion?: { sentence: string };
}

export default function ReadingOptions({ displayText: _displayText, currQuestion: _currQuestion }: ReadingOptionsProps) {
    const draggables = notes.map((note, index) => (
        <Draggable key={note} id={`draggable-${note}`}>
            {note}
        </Draggable>
    ));

    return (
        <div className="small-btn-wrapper">
            {draggables}
        </div>
    );
}
