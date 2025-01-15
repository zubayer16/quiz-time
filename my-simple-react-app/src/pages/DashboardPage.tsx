import React, { useEffect, useState } from 'react';
import { Bell, Search, User, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from '../graphql/queries/user';
import { GET_RECOMMENDED_QUIZ } from '../graphql/queries/quiz';
import InstructionsModal from '../components/modals/InstructionsModal';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface RecommendedQuiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const DashboardPage = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [initialTime] = useState(300); // 5 minutes
  const categories = [
    { name: 'Default Quizzes', quizCount: 1, icon: '🔬' },
    { name: 'Timed Quizzes', quizCount: 1, icon: '⏱️' },
  ];
  const navigate = useNavigate();
  const { userId, firstName } = useAuth();
  const {
    loading: statsLoading,
    error: statsError,
    data: statsData,
    refetch: refetchStats,
  } = useQuery(GET_USER_STATS, {
    variables: { userId },
    fetchPolicy: 'network-only', // Don't use cache
  });

  // Fetch the recommended quiz
  const {
    loading: recommendedLoading,
    error: recommendedError,
    data: recommendedData,
    refetch: refetchRecommended,
  } = useQuery(GET_RECOMMENDED_QUIZ, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only', // Don't use cache
  });

  const [recommendedQuiz, setRecommendedQuiz] = useState<RecommendedQuiz>();
  const [showInstructions, setShowInstructions] = React.useState(false);

  useEffect(() => {
    if (recommendedData?.recommendedQuiz) {
      setRecommendedQuiz(recommendedData.recommendedQuiz);
    }
  }, [recommendedData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchStats();
        refetchRecommended();
      }
    };

    // Refetch on mount
    refetchStats();
    refetchRecommended();

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchStats, refetchRecommended]);

  if (statsLoading) return <div>Loading stats...</div>;
  if (statsError) return <div>Error loading stats</div>;

  const { totalScore, quizzesCompleted, averageScore, lastQuizDate, monthlyProgress } =
    statsData.getUserStats;

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Timed Quizzes') {
      navigate(`/quizzes/${categoryName.toLowerCase()}`, { state: { isTimedQuiz: true } }); // Add query parameter for timed quizzes
    } else {
      navigate(`/quizzes/${categoryName.toLowerCase()}`);
    }
  };
  //

  const handleRecommendedQuiz = () => {
    // Navigate to quiz view with the recommended questions
    setShowInstructions(true);
  };

  const handleTimedQuizClick = () => {
    // Navigate to the timed quiz page or initiate the quiz
    navigate('/quiz'); // Make sure this route is configured in your router
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='mb-8'>
          {/*TODO: Decode the token and fetch userId from the token and then fetch user data from the database*/}
          <h1 className='text-3xl font-bold text-gray-900'>
            Welcome back {firstName ? firstName : ''} 👋
          </h1>
          <p className='mt-2 text-gray-600'>Ready to challenge yourself today?</p>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <Card>
            <CardHeader className='flex flex-row items-center space-x-2'>
              <Trophy className='h-5 w-5 text-yellow-500' />
              <CardTitle className='text-lg'>Total Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{totalScore}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center space-x-2'>
              <BookOpen className='h-5 w-5 text-blue-500' />
              <CardTitle className='text-lg'>Quizzes Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{quizzesCompleted}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center space-x-2'>
              <TrendingUp className='h-5 w-5 text-green-500' />
              <CardTitle className='text-lg'>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{Math.round(averageScore)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <section className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Quiz Categories</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {categories.map((category) => (
              <Card
                key={category.name}
                className='hover:shadow-lg transition-shadow cursor-pointer'
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className='p-6'>
                  <div className='text-4xl mb-4'>{category.icon}</div>
                  <h3 className='font-semibold text-lg'>{category.name}</h3>
                  {/* <p className='text-sm text-gray-500'>{category.quizCount} quizzes</p> */}
                </CardContent>
              </Card>
            ))}
            {/* Recommended Quiz */}
            {recommendedQuiz && (
              <Card
                className='hover:shadow-lg transition-shadow cursor-pointer'
                onClick={handleRecommendedQuiz}
              >
                <CardContent className='p-6'>
                  <div className='text-4xl mb-4'>⭐</div>
                  <h3 className='font-semibold text-lg'>Recommended Quiz</h3>
                  <p className='text-sm text-gray-500'>Based on your last attempt</p>
                </CardContent>
              </Card>
            )}
          </div>
          {recommendedQuiz && (
            <InstructionsModal
              isOpen={showInstructions}
              isRecommended={true}
              onClose={() => setShowInstructions(false)}
              quiz={recommendedQuiz}
            />
          )}
        </section>
        {/* Timed Quiz Card */}
        {/* <Card
          className='hover:shadow-lg transition-shadow cursor-pointer bg-blue-500 text-white'
          onClick={handleTimedQuizClick}
        >
          <CardContent className='p-6'>
            <div className='text-4xl mb-4'>⏱️</div>
            <h3 className='font-semibold text-lg'>Timed Quiz</h3>
            <p className='text-sm'>Challenge yourself against the clock!</p>
          </CardContent>
        </Card> */}

        {/* Recent Activity Section 
        <section>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>Continue Learning</h2>
          <div className='space-y-4'>
            {recentQuizzes.map((quiz) => (
              <Card key={quiz.name} className='hover:shadow-md transition-shadow cursor-pointer'>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold'>{quiz.name}</h3>
                      <p className='text-sm text-gray-500'>Progress: {quiz.progress}</p>
                    </div>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='h-4 w-4 mr-1' />
                      {quiz.timeLeft} left
                    </div>
                  </div>
                  <div className='mt-2 h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-blue-600 rounded-full'
                      style={{ width: quiz.progress }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        */}
      </main>
    </div>
  );
};

export default DashboardPage;
