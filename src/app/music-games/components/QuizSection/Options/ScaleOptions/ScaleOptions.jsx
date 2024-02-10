import { useState } from "react";
import "./ScaleOptions.scss";
import sharp from "../../../../assets/svg/SharpSymbol.svg";
import bimol from "../../../../assets/svg/BimolSymbol.svg";

const notes = ["C", "D", "E", "F", "G", "A", "B"];
const notes2 = ["C#", "D♭", "E♭", "F#", "G#", "A♭", "B♭"];
const chords = ["Major", "Natural", "Harmonic", "Melodic"];

export default function ScaleOptions({ handleOptionClick, level }) {
    const [selectedNote, setSelectedNote] = useState("");

    const handleNoteClick = (note) => {
        setSelectedNote(note);
    };

    const handleChordClick = (chord) => {
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
                    level == "easy" ? (
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
                            {note[1] == "#" ? (
                                <img src={sharp}></img>
                            ) : (
                                <img src={bimol}></img>
                            )}
                        </button>
                    )
                )}
            </div>
            <div className="large-btn-wrapper" style={{ marginTop: 20 }}>
                {chords.map((chord, index) => (
                    <button
                        className="option-btn large-btn"
                        key={index}
                        onClick={() => handleChordClick(chord)}
                    >
                        {chord == "Major" ? chord : chord + " Minor"}
                    </button>
                ))}
            </div>
        </>
    );
}
