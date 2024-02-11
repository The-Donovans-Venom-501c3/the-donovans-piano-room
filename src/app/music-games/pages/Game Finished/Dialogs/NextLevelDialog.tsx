import React from "react";
import "./Dialogs.scss";

import padlock from "../../assets/svg/NextLevel_Unlocked.svg"

export default function NextLevelDialog() {
  return (
    <div className="wrapper">
      <div className="content next-level centralized">
        <img src={padlock} alt="padlock" className="padlock" />
        <span className="message">{"You've unlocked the next level"}</span>
        <div className="button-container centralized">

        <button className="primary" > NEXT LEVEL </button>
        <button className="secondary" > PLAY AGAIN </button>
        <button className="secondary" > SEE OTHER GAMES </button>
        </div>
      </div>
    </div>
  );
}
