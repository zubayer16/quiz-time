import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import LandingPage from './pages/LandingPage';
import RegistrationForm from './pages/auth/RegistrationForm';
import DashboardPage from './pages/DashboardPage';
import QuizzesPage from './pages/QuizzesPage';
import QuizView from './pages/QuizView';
import QuizResults from './pages/QuizResults';
import ProtectedRoute from './components/ProtectedRoute';

// Shared Navigation Component
const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  /*return (
    <div className="navigation">
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div>
          <a href="/home" className="text-lg font-bold">Home</a>
        </div>
        {isAuthenticated && (
          <div className="flex gap-4">
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
          </div>
        )}
      </nav>
    </div>
  );*/
};

// Helper component to check authentication status
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/' element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/quiz/:quizId'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <QuizView />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/quizzes/:category'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <QuizzesPage />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/results'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <Results score={0} totalQuestions={0} />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/timed-quizzes'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <TimedQuizzes />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/select-difficulty'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <MultipleDifficulty />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/leaderboards'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <Leaderboards />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/track-progress'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <UserProgress />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/multiplayer'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <Multiplayer />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/recommendations'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <Recommendations />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
          <Route
            path='/quiz-results/:submissionId'
            element={
              <ProtectedRoute>
                <RequireAuth>
                  <QuizResults />
                </RequireAuth>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;