import { useAtomValue, useAtom } from "jotai";
import { useState, useEffect } from "react";
import { resetTimerAtom, timerOnAtom, seconds } from "../../../store/atoms";

export default function Timer() {
  const timerOn = useAtomValue(timerOnAtom);
  const resetTimer = useAtomValue(resetTimerAtom);
  //const [seconds, setSeconds] = useState(0);
  const [secondsTimer, setSeconds] = useAtom(seconds);

  useEffect(() => {
    let interval;
    if (timerOn) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    setSeconds(0);
  }, [resetTimer]);

  // const resetTimer = () => {
  //   setSeconds(0);
  // };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return <span id="timer">{formatTime(secondsTimer)}</span>;
}
