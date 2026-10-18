import React, { useRef, useState } from "react";
import type { OptionClickHandler } from "../../../../types";
import "./MathOptions.scss";

export default function MathOptions({
  handleOptionClick,
  wrongOptions = [],
  correctOption = null,
  locked = false,
}: {
  handleOptionClick: OptionClickHandler;
  wrongOptions?: string[];
  // Set from a correct pick until the next question loads
  correctOption?: string | null;
  // Answers aren't accepted right now (question answered or Wrong popover up), so every button is disabled
  locked?: boolean;
}) {
  const [inputValue, setInputValue] = useState<string>("");
  // Set by Submit, so the next digit starts a new number instead of adding to the wrong one
  const startNewRef = useRef(false);

  // No typing after a correct answer either, while the game moves on
  const disabled = locked || correctOption !== null;
  // The typed number was already a wrong answer for this question
  const isWrong = wrongOptions.includes(inputValue);

  // The first digit after a Submit starts a new number, and so does a digit after
  // a lone 0, so "05" can't be submitted for 5
  const handleNumClick = (digit: string) => {
    const startNew = startNewRef.current;
    startNewRef.current = false;
    setInputValue((prev) => (startNew || prev === "0" ? digit : prev + digit));
  };

  const handleClear = () => {
    startNewRef.current = false;
    setInputValue("");
  };

  const handleBackspace = () => {
    startNewRef.current = false;
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "" && !isWrong) {
      startNewRef.current = true;
      handleOptionClick(inputValue);
    }
  };

  // Saved answers and Review have nothing typed, so show the right answer,
  // or the last wrong one when the game ended on this question
  const displayValue =
    correctOption ?? (inputValue || (locked ? wrongOptions[wrongOptions.length - 1] ?? "" : ""));
  const displayClass =
    correctOption !== null ? "correct" : wrongOptions.includes(displayValue) ? "wrong" : "";

  return (
    <div className="math-options-container">
      {/* Display box showing the number being entered */}
      <output
        className={`option-output ${displayClass}`}
        aria-label="Your answer"
      >
        {displayValue}
      </output>

      {/* Row 1: Numbers 1-5 */}
      <div className="small-btn-wrapper small-btn-wrapper-5 math">
        {["1", "2", "3", "4", "5"].map((num) => (
          <button
            key={num}
            className="option-btn small-btn"
            onClick={() => handleNumClick(num)}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Row 2: Numbers 6-0 */}
      <div className="small-btn-wrapper small-btn-wrapper-5 math">
        {["6", "7", "8", "9", "0"].map((num) => (
          <button
            key={num}
            className="option-btn small-btn"
            onClick={() => handleNumClick(num)}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Row 3: Action Controls */}
      <div className="small-btn-wrapper math">
        <button
          className="option-btn small-btn clear-btn"
          onClick={handleClear}
          disabled={disabled}
        >
          Clear
        </button>
        <button
          className="option-btn small-btn del-btn"
          onClick={handleBackspace}
          disabled={disabled}
        >
          ⌫
        </button>
        <button
          className="option-btn small-btn submit-btn"
          onClick={handleSubmit}
          disabled={disabled || inputValue === "" || isWrong}
        >
          Submit
        </button>
      </div>
    </div>
  );
}