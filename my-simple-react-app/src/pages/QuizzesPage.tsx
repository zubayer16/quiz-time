import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Clock, Users, Award } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from '../graphql/queries/quiz';
import InstructionsModal from '../components/modals/InstructionsModal';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
}

const QuizzesPage = () => {
  const { loading, error, data } = useQuery(GET_QUIZZES);
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = React.useState<Quiz | null>(null);
  const [showInstructions, setShowInstructions] = React.useState(false);

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowInstructions(true);
  };

  useEffect(() => {
    if (data) {
      setQuizzes(data.quizzes);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // This would typically come from your API
  //   const quizzes: Quiz[] = [
  //     {
  //       id: '1',
  //       title: 'Basic JavaScript Concepts',
  //       description: 'Test your knowledge of JavaScript fundamentals',
  //       duration: 30,
  //       questionCount: 20,
  //       difficulty: 'Easy',
  //       participants: 1500,
  //     },
  //     {
  //       id: '2',
  //       title: 'Advanced JavaScript Patterns',
  //       description: 'Deep dive into advanced JavaScript patterns and concepts',
  //       duration: 45,
  //       questionCount: 25,
  //       difficulty: 'Hard',
  //       participants: 800,
  //     },
  //     // Add more quizzes...
  //   ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 capitalize'>{category} Quizzes</h1>
            <p className='text-gray-600 mt-2'>Choose a quiz to test your knowledge</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className='hover:shadow-lg transition-all duration-300 cursor-pointer'
              >
                <CardHeader>
                  <CardTitle className='text-xl'>{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600 mb-4'>{quiz.description}</p>

                  <div className='space-y-2'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Clock className='h-4 w-4 mr-2' />
                      45 minutes
                    </div>

                    <div className='flex items-center text-sm text-gray-500'>
                      <Award className='h-4 w-4 mr-2' />
                      <span className={getDifficultyColor('Medium')}>Medium</span>
                    </div>

                    <div className='flex items-center text-sm text-gray-500'>
                      <Users className='h-4 w-4 mr-2' />
                      100 participants
                    </div>
                  </div>

                  <div className='mt-4 pt-4 border-t'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-gray-500'>
                        {quiz.questions.length} questions
                      </span>
                      <button
                        className='text-blue-50 hover:text-blue-200 font-medium'
                        onClick={() => handleStartQuiz(quiz)}
                      >
                        Start Quiz →
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {selectedQuiz && (
        <InstructionsModal
          isOpen={showInstructions}
          isRecommended={false}
          onClose={() => setShowInstructions(false)}
          quiz={selectedQuiz}
        />
      )}
    </>
  );
};

export default QuizzesPage;
