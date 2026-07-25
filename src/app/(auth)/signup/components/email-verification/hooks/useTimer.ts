import { useEffect, useRef, useState, useCallback } from 'react';

export const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer(); // Ensure no duplicate intervals exist

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopTimer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(initialTime);
    startTimer();
  }, [initialTime, startTimer, stopTimer]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // Helper for MM:SS formatting
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { 
    timeLeft, 
    resetTimer, 
    startTimer, 
    stopTimer, 
    formattedTime 
  };
};