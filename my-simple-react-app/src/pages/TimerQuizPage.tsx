// src/pages/TimerQuizPage.tsx
import React from 'react';
import Timer from '../components/Timer'; // Adjust the path as needed
// Other imports...

const TimerQuizPage: React.FC = () => {
  const initialTime = 300; // example time in seconds

  const handleTimeUp = () => {
    console.log("Time's up!");
    // Handle what happens when time is up
  };

  return (
    <div>
      <div style={{ padding: '20px' }}>
        <h2>Timed Quiz</h2>
        <Timer initialTime={initialTime} onTimeUp={handleTimeUp} />
      </div>
    </div>
  );
};

export default TimerQuizPage;
