import { useState } from "react";

import "./MusicToggle.scss";


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
            <img src="/games/MusicNote.svg" alt="play music toggle" />
          </button>
          <span>{musicOn? "ON" : "OFF"}</span>
        </div>
    </div>
  );
}
