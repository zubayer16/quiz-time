import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_QUIZ_RESULT } from '../graphql/queries/quiz';

const QuizResults = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { submissionId } = useParams();
  const location = useLocation();
  const isRecommended = location.state?.isRecommended || false;

  const { loading, error, data } = useQuery(GET_QUIZ_RESULT, {
    variables: { submissionId, userId, isRecommended },
  });

  if (loading) return <div>Loading results...</div>;
  if (error) return <div>Error loading results: {error.message}</div>;

  const { score, answers, quiz } = data.getQuizResult;
  const percentage = (score / quiz.questions.length) * 100;

  return (
    <div className='min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Quiz Results</CardTitle>
          <p className='text-gray-500'>{quiz.title}</p>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='text-center space-y-4'>
            <div className='inline-block p-4 rounded-full bg-blue-50'>
              <Award className='w-12 h-12 text-blue-500' />
            </div>
            <h2 className='text-3xl font-bold'>
              {score} out of {quiz.questions.length} correct
            </h2>
            <Progress value={percentage} className='h-2 w-full' />
            <p className='text-lg text-gray-600'>You scored {Math.round(percentage)}%</p>
          </div>

          <div className='flex justify-center pt-4'>
            <Button onClick={() => navigate('/home')} className='flex items-center gap-2'>
              <Home className='w-4 h-4' />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResults;
