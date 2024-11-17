import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login'; // New login page
import Quiz from './pages/Quiz';
import QuizCategory from './pages/QuizCategory'; // Handles dynamic quiz categories
import Results from './pages/Results';
import TimedQuizzes from './pages/features/TimedQuizzes';
import MultipleDifficulty from './pages/features/MultipleDifficulty';
import Leaderboards from './pages/features/Leaderboards';
import UserProgress from './pages/features/UserProgress';
import Multiplayer from './pages/features/Multiplayer';
import Recommendations from './pages/features/Recommendations';
import ProtectedRoute from './components/ProtectedRoute'; // For protected routes
import categories from './utils/categories'; // Assumes this is properly structured

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />

                {/* Protected Routes */}
                <Route
                    path="/quiz"
                    element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    }
                />
                {categories &&
                    categories.map((category, index) => (
                        <Route
                            key={index}
                            path={category.path}
                            element={
                                <ProtectedRoute>
                                    <QuizCategory category={category.name} />
                                </ProtectedRoute>
                            }
                        />
                    ))}

                <Route
                    path="/results"
                    element={
                        <ProtectedRoute>
                            <Results />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/timed-quizzes"
                    element={
                        <ProtectedRoute>
                            <TimedQuizzes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/select-difficulty"
                    element={
                        <ProtectedRoute>
                            <MultipleDifficulty />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/leaderboards"
                    element={
                        <ProtectedRoute>
                            <Leaderboards />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/track-progress"
                    element={
                        <ProtectedRoute>
                            <UserProgress />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/multiplayer"
                    element={
                        <ProtectedRoute>
                            <Multiplayer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recommendations"
                    element={
                        <ProtectedRoute>
                            <Recommendations />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
