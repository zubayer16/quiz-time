import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Home } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: any[]; // Replace with your Question type
  quizTitle: string;
}

const QuizResults = ({
  score,
  totalQuestions,
  answers,
  questions,
  quizTitle,
}: QuizResultsProps) => {
  const navigate = useNavigate();
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className='min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold'>Quiz Results</CardTitle>
          <p className='text-gray-500'>{quizTitle}</p>
        </CardHeader>

        <CardContent className='space-y-6'>
          {/* Score Overview */}
          <div className='text-center space-y-4'>
            <div className='inline-block p-4 rounded-full bg-blue-50'>
              <Award className='w-12 h-12 text-blue-500' />
            </div>
            <h2 className='text-3xl font-bold'>
              {score} out of {totalQuestions} correct
            </h2>
            <Progress value={percentage} className='h-2 w-full' />
            <p className='text-lg text-gray-600'>You scored {Math.round(percentage)}%</p>
          </div>

          {/* Question Review */}
          <div className='space-y-4'>
            <h3 className='font-semibold text-lg'>Question Review</h3>
            {questions.map((question, index) => (
              <div key={index} className='p-4 rounded-lg bg-white border border-gray-200'>
                <div className='flex items-start gap-3'>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle2 className='w-5 h-5 text-green-500 mt-1' />
                  ) : (
                    <XCircle className='w-5 h-5 text-red-500 mt-1' />
                  )}
                  <div className='flex-1'>
                    <p className='font-medium'>{question.question}</p>
                    <div className='mt-2 space-y-1 text-sm'>
                      <p className='text-gray-600'>
                        Your answer:{' '}
                        <span
                          className={
                            answers[index] === question.correctAnswer
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {question.options[answers[index]]}
                        </span>
                      </p>
                      {answers[index] !== question.correctAnswer && (
                        <p className='text-gray-600'>
                          Correct answer:{' '}
                          <span className='text-green-600'>
                            {question.options[question.correctAnswer]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className='flex justify-center pt-4'>
            <Button onClick={() => navigate('/')} className='flex items-center gap-2'>
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
