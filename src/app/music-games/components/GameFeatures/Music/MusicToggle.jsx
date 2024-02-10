import { useState } from "react";

import "./MusicToggle.scss";

import dot from "../../../assets/svg/Dot.svg";

export function MusicToggle() {
  const [musicOn, setMusicOn] = useState(true);

  const toggleMusic = () => {
    setMusicOn(!musicOn);
  };
  return (
    <div>
      <span>Music</span>
    
        <div id="music" className= {musicOn ? "on" : "" }>
          <button
            onClick={() => {
              toggleMusic()
            }}
          >
            <img src={dot} alt="play music toggle" />
          </button>
          <span>{musicOn? "ON" : "OFF"}</span>
        </div>
    </div>
  );
}
