import { useState } from "react";
import "./ScaleOptions.scss";
import type { Level, OptionClickHandler } from "../../../../types";

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const notes2 = ["C#", "D♭", "E♭", "F#", "G#", "A♭", "B♭"];
const chords = ["Major", "Natural", "Harmonic", "Melodic"];

export default function ScaleOptions({
    handleOptionClick,
    level,
    wrongOptions = [],
    correctOption = null,
    locked = false
}: {
    handleOptionClick: OptionClickHandler;
    level: Level;
    wrongOptions?: string[];
    // Set from a correct pick until the next question loads
    correctOption?: string | null;
    // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
    locked?: boolean;
}) {
    const [selectedNote, setSelectedNote] = useState("");
    // e.g. "D♭ Harmonic" -> "D♭", "Harmonic"
    const [correctNote, correctChord] = correctOption?.split(" ") ?? [];

    const handleNoteClick = (note: string) => {
        setSelectedNote(note);
    };

    const handleChordClick = (chord: string) => {
        if (selectedNote) handleOptionClick(selectedNote + " " + chord);
    };

    return (
        <>
            <div className="small-btn-wrapper scale">
                {notes.map((note, index) => (
                    <button
                        className={`option-btn small-btn ${
                            note === correctNote ? "correct" : note === selectedNote ? "selected-note" : ""
                        }`}
                        disabled={locked}
                        key={index}
                        onClick={() => handleNoteClick(note)}
                    >
                        {note}
                    </button>
                ))}
                {notes2.map((note, index) =>
                    level === "easy" ? (
                        <div
                            className="option-blank"
                            key={index}
                        ></div>
                    ) : (
                        <button
                            className={`option-btn small-btn ${
                                note === correctNote ? "correct" : note === selectedNote ? "selected-note" : ""
                            }`}
                            disabled={locked}
                            key={index}
                            onClick={() => handleNoteClick(note)}
                        >
                            {note[0]}
                            {note[1] === "#" ? "\u266F" : "\u266D"}
                        </button>
                    )
                )}
            </div>
            <div className="large-btn-wrapper scale">
                {chords.map((chord) => {
                    const option = selectedNote + " " + chord;
                    const isWrong = !!selectedNote && wrongOptions.includes(option);
                    return (
                        <button
                            className={`option-btn large-btn ${
                                selectedNote ? "note-selected" : ""
                            } ${
                                locked ? "locked" : ""
                            } ${
                                isWrong ? "wrong" : chord === correctChord ? "correct" : ""
                            }`}
                            key={chord}
                            onClick={() => handleChordClick(chord)}
                            disabled={locked || !selectedNote || isWrong}
                            title={!locked && !selectedNote ? 'Select a Note to Enable' : undefined}
                        >
                            {chord === "Major" ? chord : chord + " Minor"}
                        </button>
                    );
                })}
            </div>
        </>
    );
}
