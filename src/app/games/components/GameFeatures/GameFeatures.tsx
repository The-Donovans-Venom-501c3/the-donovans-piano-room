import "./GameFeatures.scss";
import Slider from "@mui/material/Slider";
import LiveAnimated from "./LivesAnimation/lives";
import Timer from "./Timer/Timer";
import { useRef, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import {
  livesAtom,
  scoreAtom,
  musicStateAtom,
} from "@/store/game-atoms";

const GameFeatures = () => {
  const score = useAtomValue(scoreAtom);
  const lives = useAtomValue(livesAtom);
  const [musicOn, setMusicOn] = useAtom(musicStateAtom);
  const MAX = 100;

  const audioRef = useRef<HTMLAudioElement>(null);
  const src = "/Bongo.wav";

  const handleChangeSwitch = () => {
    setMusicOn(!musicOn);
    if (musicOn) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => setMusicOn(false));
    }
  };

  const handleChangeVolume = (_event: Event, value: number | number[]) => {
    const volume = (Array.isArray(value) ? value[0] : value) / MAX;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  useEffect(() => {
    if (musicOn) {
      audioRef.current?.play().catch(() => setMusicOn(false));
    } else {
      audioRef.current?.pause();
    }
  }, [musicOn, setMusicOn]);

  return (
    <div className="gameFeatureContainer">
      <div className="gameHeaderHUD">
        <div className="hudItem">
          <span className="hudLabel">Lives:</span>
          <span id="lives">
            {Array.from({ length: lives }, (_, index) => (
              <LiveAnimated key={index} />
            ))}
          </span>
        </div>

        <div className="hudItem">
          <span className="hudLabel">Score:</span>
          <span id="score">{score}</span>
        </div>

        <div className="hudItem">
          <span className="hudLabel">Time:</span>
          <Timer />
        </div>

        <div className="hudItem controls">
          <button className={`musicBtn ${musicOn ? "on" : ""}`} onClick={handleChangeSwitch}>
            <img src="/games/MusicNote.svg" alt="Music toggle" />
            <span>{musicOn ? "ON" : "OFF"}</span>
          </button>

          <div id="volume">
            <Slider
              defaultValue={30}
              onChange={handleChangeVolume}
              size="small"
              sx={{
                width: "60px",
                color: "#BFBABB",
                "& .MuiSlider-thumb": {
                  color: "#F0EEEE",
                  width: 14,
                  height: 14,
                },
              }}
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} loop src={src} />
    </div>
  );
};

export default GameFeatures;