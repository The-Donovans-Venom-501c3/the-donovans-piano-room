import React, { useState } from "react";
import type { OptionClickHandler } from "../../../../types";
import "./MathOptions.scss";

export default function MathOptions({
  handleOptionClick,
}: {
  handleOptionClick: OptionClickHandler;
}) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleNumClick = (digit: string) => {
    setInputValue((prev) => prev + digit);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      handleOptionClick(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="math-options-container">
      {/* Display box showing current numeric input */}
      <input
        type="text"
        readOnly
        value={inputValue}
        placeholder="0"
      />

      {/* Row 1: Numbers 1-5 */}
      <div className="small-btn-wrapper small-btn-wrapper-5 math">
        {["1", "2", "3", "4", "5"].map((num) => (
          <button
            key={num}
            className="option-btn small-btn"
            onClick={() => handleNumClick(num)}
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
          >
            {num}
          </button>
        ))}
      </div>

      {/* Row 3: Action Controls */}
      <div className="small-btn-wrapper math">
        <button
          className="option-btn small-btn"
          onClick={handleClear}
          style={{ paddingLeft: "14px", paddingRight: "14px" }}
        >
          Clear
        </button>
        <button
          className="option-btn small-btn"
          onClick={handleBackspace}
          style={{ paddingLeft: "14px", paddingRight: "14px" }}
        >
          ⌫
        </button>
        <button
          className="option-btn small-btn"
          onClick={handleSubmit}
          style={{ paddingLeft: "20px", paddingRight: "20px" }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}