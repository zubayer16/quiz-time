import React from 'react';
import { Link } from 'react-router-dom';
import './Results.css';  // Assuming you create a separate CSS file for styling

function Results({ score, totalQuestions }) {
    const scorePercentage = (score / totalQuestions) * 100;

    const getPerformanceMessage = () => {
        if (scorePercentage >= 80) {
            return "Excellent work! You're a trivia master!";
        } else if (scorePercentage >= 50) {
            return "Good effort! Keep practicing to improve!";
        } else {
            return "Looks like you need some more practice. Try again!";
        }
    };

    return (
        <div className="results-container">
            <h1>Quiz Completed</h1>
            <p>Your score: {score} out of {totalQuestions} ({scorePercentage.toFixed(2)}%)</p>
            <p>{getPerformanceMessage()}</p>
            <Link to="/">Go to Home</Link>
            <div>
                <button onClick={() => window.location.reload()}>Retake Quiz</button>
            </div>
            {/* Example for social media sharing (pseudo-code) */}
            <button onClick={() => console.log('Share this result!')}>Share on Social Media</button>
        </div>
    );
}

export default Results;
