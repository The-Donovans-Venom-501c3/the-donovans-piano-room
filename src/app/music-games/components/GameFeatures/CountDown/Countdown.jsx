import { useAtomValue } from "jotai";
import { useState, useEffect } from "react";
import { levelStateAtom, countDownOnAtom } from "../../../store/atoms";
export default function Countdown() {
  const countDownOn = useAtomValue(countDownOnAtom);
  const level = useAtomValue(levelStateAtom);
  const [secondsLeft, setSecondsLeft] = useState(0);
 useEffect(()=>{ level === "easy"
  ? setSecondsLeft(15)
  : level === "medium"
  ? setSecondsLeft(10)
  : setSecondsLeft(5);
},[countDownOn])

  useEffect(() => {
    if (countDownOn && secondsLeft > 0) {
      setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
        console.log(secondsLeft);
      }, 1000);
    }
  }, [countDownOn,secondsLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <span id="timer">
      {secondsLeft >= 0 ? formatTime(secondsLeft) : formatTime(0)}
    </span>
  );
}
