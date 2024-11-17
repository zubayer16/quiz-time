import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Ensure CSS is correctly linked

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to the Ultimate Quiz Application</h1>
            <p>Test your knowledge across a wide range of interesting topics and challenge your friends!</p>

            <div className="features">
                <h2>What We Offer</h2>
                <ul>
                    <li>Timed Quizzes - Enhance your skills under pressure.</li>
                    <li>Multiple Difficulty Levels - Choose your challenge.</li>
                    <li>Leaderboards - See where you stand amongst peers.</li>
                    <li>User Progress Tracking - Keep track of your learning journey.</li>
                    <li>Multiplayer Options - Challenge friends or random opponents.</li>
                    <li>Personalized Recommendations - Get quiz suggestions tailored to your interests.</li>
                </ul>
            </div>

            <div className="interactives">
                <h2>Interactive Options</h2>
                <Link className="interactive-link" to="/timed-quizzes">Start a Timed Quiz</Link>
                <Link className="interactive-link" to="/select-difficulty">Select Difficulty Level</Link>
                <Link className="interactive-link" to="/leaderboards">View Leaderboards</Link>
                <Link className="interactive-link" to="/track-progress">Track Your Progress</Link>
                <Link className="interactive-link" to="/multiplayer">Multiplayer Games</Link>
                <Link className="interactive-link" to="/recommendations">View Recommendations</Link>
            </div>

            <div className="categories">
                <h2>Choose a Category to Get Started:</h2>
                <div className="category-list">
                    <Link className="category-link" to="/quiz/math">Math</Link>
                    <Link className="category-link" to="/quiz/science">Science</Link>
                    <Link className="category-link" to="/quiz/football">Football</Link>
                    <Link className="category-link" to="/quiz/films">Films</Link>
                    <Link className="category-link" to="/quiz/news">News</Link>
                </div>
            </div>

            <div className="testimonials">
                <h2>What Our Users Say</h2>
                <p>"I love the challenges on this site! The questions make me think and keep me entertained." - Jane Doe</p>
            </div>

            <footer>
                <p>Contact Us | About | Terms of Service</p>
            </footer>
        </div>
    );
}

export default Home;
