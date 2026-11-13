import { useState } from "react";
import "./ScaleOptions.scss";
import type { Level, OptionClickHandler } from "../../../../types";

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const notes2 = ["C#", "D♭", "E♭", "F#", "G#", "A♭", "B♭"];
const chords = ["Major", "Natural", "Harmonic", "Melodic"];

export default function ScaleOptions({ handleOptionClick, level }: { handleOptionClick: OptionClickHandler; level: Level }) {
    const [selectedNote, setSelectedNote] = useState("");

    const handleNoteClick = (note: string) => {
        setSelectedNote(note);
    };

    const handleChordClick = (chord: string) => {
        if (selectedNote) {
            handleOptionClick(selectedNote + " " + chord);
            setSelectedNote("");
        }
    };

    return (
        <>
            <div className="small-btn-wrapper">
                {notes.map((note, index) => (
                    <button
                        className={`option-btn small-btn ${
                            note === selectedNote ? "selected-note" : ""
                        }`}
                        key={index}
                        onClick={() => handleNoteClick(note)}
                        style={{ height: 45 }}
                    >
                        {note}
                    </button>
                ))}
                {notes2.map((note, index) =>
                    level === "easy" ? (
                        <div
                            className="option-blank"
                            key={index}
                            style={{ height: 45 }}
                        ></div>
                    ) : (
                        <button
                            className={`option-btn small-btn ${
                                note === selectedNote ? "selected-note" : ""
                            }`}
                            key={index}
                            onClick={() => handleNoteClick(note)}
                            style={{ height: 45 }}
                        >
                            {note[0]}
                            {note[1] === "#" ? (
                                <img src="/games/SharpSymbol.svg" alt="Sharp" />
                            ) : (
                                <img src="/games/BimolSymbol.svg" alt="Flat" />
                            )}
                        </button>
                    )
                )}
            </div>
            <div className="large-btn-wrapper" style={{ marginBottom: 20 , marginTop:10}}>
                {chords.map((chord, index) => (
                    <button
                        className="option-btn large-btn"
                        key={index}
                        onClick={() => handleChordClick(chord)}
                    >
                        {chord === "Major" ? chord : chord + " Minor"}
                    </button>
                ))}
            </div>
        </>
    );
}
