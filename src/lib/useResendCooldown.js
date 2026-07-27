import { useState, useEffect, useRef } from 'react';

export function useResendCooldown(initialSeconds = 45) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const start = (seconds = initialSeconds) => {
    setSecondsLeft(seconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return { secondsLeft, start, isActive: secondsLeft > 0 };
}