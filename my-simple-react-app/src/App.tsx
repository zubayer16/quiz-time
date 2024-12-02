import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Quiz from './pages/Quiz';
import QuizCategory from './pages/QuizCategory';
import Results from './pages/Results';
import TimedQuizzes from './pages/features/TimedQuizzes';
import MultipleDifficulty from './pages/features/MultipleDifficulty';
import Leaderboards from './pages/features/Leaderboards';
import UserProgress from './pages/features/UserProgress';
import Multiplayer from './pages/features/Multiplayer';
import Recommendations from './pages/features/Recommendations';
import ProtectedRoute from './components/ProtectedRoute';
import categories from './utils/categories';
import LandingPage from './pages/LandingPage';
import RegistrationForm from './pages/auth/RegistrationForm';
import DashboardPage from './pages/DashboardPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizView from './pages/QuizView';
import QuizResults from './pages/QuizResults';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/' element={<LandingPage />} />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/quiz/:quizId'
          element={
            <ProtectedRoute>
              <QuizView />
            </ProtectedRoute>
          }
        />

        <Route
          path='/quizzes/:category'
          element={
            <ProtectedRoute>
              <QuizzesPage />
            </ProtectedRoute>
          }
        />

        

        {/* Protected Routes */}
        <Route
          path='/quiz'
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
          path='/results'
          element={
            <ProtectedRoute>
              <Results score={0} totalQuestions={0} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/timed-quizzes'
          element={
            <ProtectedRoute>
              <TimedQuizzes />
            </ProtectedRoute>
          }
        />
        <Route
          path='/select-difficulty'
          element={
            <ProtectedRoute>
              <MultipleDifficulty />
            </ProtectedRoute>
          }
        />
        <Route
          path='/leaderboards'
          element={
            <ProtectedRoute>
              <Leaderboards />
            </ProtectedRoute>
          }
        />
        <Route
          path='/track-progress'
          element={
            <ProtectedRoute>
              <UserProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path='/multiplayer'
          element={
            <ProtectedRoute>
              <Multiplayer />
            </ProtectedRoute>
          }
        />
        <Route
          path='/recommendations'
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
