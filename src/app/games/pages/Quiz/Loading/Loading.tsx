"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { appStateAtom, quizStateAtom } from "@/store/game-atoms";
import styles from "./Loading.scss";

const yellowCat = "/games/Character_Loading.svg";

export default function Loading() {
  const setAppState = useSetAtom(appStateAtom);
  const setQuizState = useSetAtom(quizStateAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState("quiz");
      setQuizState("quiz");
    }, 3000);

    return () => clearTimeout(timer);
  }, [setAppState, setQuizState]);

  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.curtainPanel} ${styles.left}`} />
      <div className={`${styles.curtainPanel} ${styles.right}`} />

      <div className={styles.loadingCard}>
        <img src={yellowCat} alt="Loading Mascot" className={styles.cat} />

        <h1>
          Get Ready for <span>Awesomeness!</span>
        </h1>

        <p>
          For each mission, you will be shown a music note. Choose one correct
          answer from the options given.
        </p>

        <p className={styles.statusText}>
          Directing you to the game in a moment...
        </p>

        <div className={styles.loaderTrack}>
          <div className={styles.loaderFill} />
        </div>
      </div>
    </div>
  );
}