import "./GameFeatures.scss";
import musicnote from "../../assets/svg/MusicNote.svg";
import dot from "../../assets/svg/Dot.svg";
import Slider from "@mui/material/Slider";
import LiveAnimated from "./LivesAnimation/lives";
import Timer from "./Timer/Timer";
import { useRef, useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import {
  livesAtom,
  scoreAtom,
  musicStateAtom,
  levelStateAtom,
} from "../../store/atoms";

const GameFeatures = () => {
  const score = useAtomValue(scoreAtom);
  const lives = useAtomValue(livesAtom);
  const level = useAtomValue(levelStateAtom);
  const [musicOn, setMusicOn] = useAtom(musicStateAtom);
  const MAX = 100;

  const audioRef = useRef(null);

  let src =
    level === "easy"
      ? "/easy.mp3"
      : level === "medium"
      ? "/medium.mp3"
      : "hard.mp3";

  const handleChangeSwitch = () => {
    setMusicOn(!musicOn);
    if (musicOn) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  const handleChangeVolume = (e) => {
    const { value } = e.target;
    const volume = Number(value) / MAX;
    audioRef.current.volume = volume;
  };

  useEffect(() => {
    if (musicOn) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [musicOn]);

  return (
    <div className="gameFeatureContainer">
      <div className="gameLives">
        <div>
          <span className="gameFeatureName">Timer</span>
          <div className="gameFeatureValue">
            <Timer />
          </div>
        </div>
        <div>
          <span className="gameFeatureName">Score</span>
          <div className="gameFeatureValue">
            <span id="score">{score}</span>
          </div>
        </div>
        <div>
          <span className="gameFeatureName">Lives</span>
          <div className="gameFeatureValue">
            <span id="lives">
              {Array.from({ length: lives }, (_, index) => (
                <LiveAnimated key={index} src={musicnote} />
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className="gameSetting">
        <div>
          <span className="gameFeatureName">Music</span>
          <div id="music" className={musicOn ? "on" : ""}>
            <button onClick={handleChangeSwitch}>
              <img src={dot} alt="Music toggle" />
            </button>
            <span className="gameFeatureValue">{musicOn ? "ON" : "OFF"}</span>
            {/* <FormControlLabel
              label={musicOn ? 'ON' : 'OFF'}
              sx={{
                '.MuiFormControlLabel-label': {
                  color: '#817676',
                  fontSize: '20px',
                  lineHeight: '30px',
                },
              }}
              control={
                <Switch color='success'
                  sx={{
                    '& .MuiSwitch-thumb': { 
                      borderRadius: '5px',
                      height: '5vh',
                      backgroundColor: '$grey-100',
                      border: '2px solid $grey-500',
                      width: '3.5vw',
                      transform: 'translateX(0px)',
                      boxShadow: '0px 5px 0px 0px #BFBABB',

                    },
                    '& .MuiSwitch-track': {
                      borderRadius: '5px',
                      width: '25vw'
                    },
                    '.css-1xvpzln-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked': {
                      '-webkit-transform': 'translateX(3.5vw)',
                      '-moz-transform': 'translateX(3.5vw)',
                      ' -ms-transform': 'translateX(3.5vw)',
                      transform: "translateX(3.5vw)",
                      color: '#F0EEEE'
                    },
                    width: '7vw',
                    height: '8.5vh',

                  }}
                  checked={musicOn}
                  onChange={handleChangeSwitch}
                />
              }
            /> */}
          </div>
        </div>
        <div>
          <span className="gameFeatureName">Volume</span>
          <div id="volume">
            <Slider
              defaultValue={30}
              onChange={(e) => handleChangeVolume(e)}
              valueLabelDisplay="auto"
              sx={{
                width: "7vw",
                ".css-eg0mwd-MuiSlider-thumb": {
                  color: "#F0EEEE",
                },
                "& .css-2bajgq-MuiSlider-root": {
                  color: "#F0EEEE",
                },
                ".css-1gv0vcd-MuiSlider-track": {
                  color: "#BFBABB",
                  height: "1vh",
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
