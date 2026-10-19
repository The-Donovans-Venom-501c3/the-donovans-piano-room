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
  const [enteredValue, setEnteredValue] = useState<string>("");
  // Set by Submit, so the next digit starts a new number instead of adding to the wrong one
  const startNewRef = useRef(false);
  // The display, so a digit press can flash it
  const outputRef = useRef<HTMLOutputElement>(null);

  // Flash the display yellow, then fade back to its own background and border
  const flashDisplay = () => {
    const el = outputRef.current;
    if (!el) return;
    const styles = getComputedStyle(el);
    el.animate(
      [
        {
          backgroundColor: styles.getPropertyValue("--flash-bg"),
          borderColor: styles.getPropertyValue("--flash-border"),
          offset: 0,
        },
      ],
      { duration: 1000, easing: "ease-out" },
    );
  };

  // No typing after a correct answer either, while the game moves on
  const disabled = locked || correctOption !== null;
  // The typed number was already a wrong answer for this question
  const isWrong = wrongOptions.includes(enteredValue);

  // The first digit after a Submit starts a new number, and so does a digit after
  // a lone 0, so "05" can't be submitted for 5
  const handleNumClick = (digit: string) => {
    const startNew = startNewRef.current;
    startNewRef.current = false;
    setEnteredValue((prev) => (startNew || prev === "0" ? digit : prev + digit));
    flashDisplay();
  };

  const handleClear = () => {
    startNewRef.current = false;
    setEnteredValue("");
  };

  const handleBackspace = () => {
    startNewRef.current = false;
    setEnteredValue((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (enteredValue.trim() !== "" && !isWrong) {
      startNewRef.current = true;
      handleOptionClick(enteredValue);
    }
  };

  // Saved answers and Review have nothing typed, so show the right answer,
  // or the last wrong one when the game ended on this question
  const displayValue =
    correctOption ?? (enteredValue || (locked ? wrongOptions[wrongOptions.length - 1] ?? "" : ""));
  const displayClass =
    correctOption !== null ? "correct" : wrongOptions.includes(displayValue) ? "wrong" : "";

  return (
    <div className="math-options-container">
      {/* Display box showing the number being entered */}
      <output
        ref={outputRef}
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
          disabled={disabled || enteredValue === "" || isWrong}
        >
          Submit
        </button>
      </div>
    </div>
  );
}