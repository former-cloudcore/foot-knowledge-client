import { useState, useEffect } from 'react';
type Timeout = ReturnType<typeof setTimeout>;

const Timer = ({ isRunning, setTime, resetTime }: 
    { isRunning: boolean; setTime: (seconds: number) => void , resetTime:boolean}) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let intervalId: Timeout | null = null;

        if (isRunning) {
            intervalId = setInterval(() => {
                setSeconds((prevSeconds) => {
                    return prevSeconds + 1;
                });
            }, 1000); // Update every second
        } else {
            setTime(seconds);
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        setSeconds(0); 
      }, [resetTime]);

    return (
        <div>
            <span>Timer: {seconds} sec</span>
        </div>
    );
};

export default Timer;
