import React, { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  // Calculate time divisions
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      {/* Minutes */}
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": minutes } as React.CSSProperties}>
            {minutes}
          </span>
        </span>
        min
      </div>

      {/* Seconds */}
      <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": seconds } as React.CSSProperties}>
            {seconds}
          </span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Timer;
