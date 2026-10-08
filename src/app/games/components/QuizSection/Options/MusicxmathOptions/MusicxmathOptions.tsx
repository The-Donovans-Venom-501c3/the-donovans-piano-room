import React, { useState } from "react";
import type { OptionClickHandler } from "../../../../types";

export default function MusicxmathOptions({
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
    <div className="musicxmath-options-container" style={{ marginTop: 20 }}>
      {/* Display box showing current numeric input */}
      <div className="small-btn-wrapper" style={{ marginBottom: 15 }}>
        <input
          type="text"
          readOnly
          value={inputValue}
          placeholder="0"
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            textAlign: "center",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "2px solid #ccc",
            width: "160px",
            color: "#000",
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* Row 1: Numbers 1-5 */}
      <div className="small-btn-wrapper small-btn-wrapper-6">
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
      <div className="small-btn-wrapper small-btn-wrapper-6" style={{ marginTop: 8 }}>
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
      <div className="small-btn-wrapper" style={{ marginTop: 12 }}>
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