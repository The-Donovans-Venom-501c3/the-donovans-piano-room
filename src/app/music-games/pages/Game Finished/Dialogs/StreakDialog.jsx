import React from "react";
import "./Dialogs.scss";
import streak from "../../assets/svg/Streak_Icon.svg";
import strike from "../../assets/svg/Strike_Icon.svg";
import grey_circle from "../../assets/svg/Grey_Circle.svg";

export default function StreakDialog() {
  return (
    <div className="wrapper">
      <div className="content  streak-dialog centralized">
        <img src={strike} alt="music-symbol" className="" />
        <p className="streak-days">
          Congrats! You got <strong>1 Day</strong> Streak
        </p>
        <div className="streak-content centralized">
          <div className="streak centralized">
            <span>
              1<img src={streak} className="filled" alt="streak symbol" />{" "}
            </span>
            <span>
              2 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
            <span>
              3 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
            <span>
              4 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
            <span>
              5 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
            <span>
              6 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
            <span>
              7 <img src={grey_circle} className="not-filled" alt="not filled hole" />{" "}
            </span>
          </div>
          <hr />
          <p>
            Successfully complete a game every day to grow your streak. Skipping
            even for a day will reset your streak. You’ll get a reward after
            7-day streak!
          </p>
        </div>
        <div className="button-container centralized">
          <button className="primary"> CONTINUE </button>
        </div>
      </div>
    </div>
  );
}
