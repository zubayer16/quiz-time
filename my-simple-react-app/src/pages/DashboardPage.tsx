import React, { useState } from 'react';
import { Bell, Search, User, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from '../graphql/queries/user';



const DashboardPage = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [initialTime] = useState(300); // 5 minutes
  const categories = [{ name: 'Default', quizCount: 1, icon: '🔬' }];
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { loading, error, data } = useQuery(GET_USER_STATS, {
    variables: { userId }
  });

  if (loading) return <div>Loading stats...</div>;
  if (error) return <div>Error loading stats</div>;

  const { totalScore, quizzesCompleted, averageScore, lastQuizDate, monthlyProgress } = data.getUserStats;

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/quizzes/${categoryName.toLowerCase()}`);
  };
 

  const recentQuizzes = [
    { name: 'Basic Chemistry', progress: '80%', timeLeft: '2 days' },
    { name: 'World History II', progress: '60%', timeLeft: '1 day' },
    { name: 'Python Basics', progress: '40%', timeLeft: '3 days' },
  ];


const handleTimedQuizClick = () => {
  // Navigate to the timed quiz page or initiate the quiz
  navigate('/quiz');  // Make sure this route is configured in your router
};



  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Hero Section */}
        <div className='mb-8'>
          {/*TODO: Decode the token and fetch userId from the token and then fetch user data from the database*/}
          <h1 className='text-3xl font-bold text-gray-900'>Welcome back, Alex! 👋</h1>
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
              <p className='text-sm text-gray-500'>Top 10% of users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center space-x-2'>
              <BookOpen className='h-5 w-5 text-blue-500' />
              <CardTitle className='text-lg'>Quizzes Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{quizzesCompleted}</p>
              <p className='text-sm text-gray-500'>Last quiz 2 days ago</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center space-x-2'>
              <TrendingUp className='h-5 w-5 text-green-500' />
              <CardTitle className='text-lg'>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold'>{Math.round(averageScore)}</p>
              <p className='text-sm text-gray-500'>+5% this month</p>
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
                  <p className='text-sm text-gray-500'>{category.quizCount} quizzes</p>
                </CardContent>
              </Card>
              
            ))}
          </div>
          

        </section>
            {/* Timed Quiz Card */}
            <Card
      className='hover:shadow-lg transition-shadow cursor-pointer bg-blue-500 text-white'
      onClick={handleTimedQuizClick}
    >
      <CardContent className='p-6'>
        <div className='text-4xl mb-4'>⏱️</div>
        <h3 className='font-semibold text-lg'>Timed Quiz</h3>
        <p className='text-sm'>Challenge yourself against the clock!</p>
      </CardContent>
    </Card>
        

        {/* Recent Activity Section */}
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
      </main>
    </div>
  );
};

export default DashboardPage;
