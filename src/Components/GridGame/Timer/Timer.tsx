import { useState, useEffect } from 'react';
type Timeout = ReturnType<typeof setTimeout>;

const Timer = ({ isRunning, setTime }: { isRunning: boolean; setTime: (seconds: number) => void }) => {
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

    return (
        <div>
            <span>Timer: {seconds} sec</span>
        </div>
    );
};

export default Timer;
