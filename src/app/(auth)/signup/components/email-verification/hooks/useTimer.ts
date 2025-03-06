import { useEffect, useRef, useState } from 'react';

export const useTimer = (initialTime: number) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        setTimeLeft(initialTime);
        if (timerRef.current) clearInterval(timerRef.current);
        startTimer();
    };

    const startTimer = () => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime - 1 <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        timerRef.current = timer;
    };

    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return { timeLeft, resetTimer };
};
