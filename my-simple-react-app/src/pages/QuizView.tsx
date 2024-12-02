import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_QUIZ_BY_ID } from '../graphql/queries/quiz';
import { SUBMIT_QUIZ } from '../graphql/mutations/quiz';
import ConfirmationDialog from '../components/modals/ConfirmationDialogModal';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
}

const QuizView = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<Quiz>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitQuiz, { loading: submitting }] = useMutation(SUBMIT_QUIZ);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_QUIZ_BY_ID, {
    variables: { quizId },
  });

  useEffect(() => {
    if (data) {
      setQuiz(data.quiz);
      if (data.quiz.questions && Array.isArray(data.quiz.questions)) {
        setQuestions(data.quiz.questions);
      }
      console.log(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>Error loading quiz: {error.message}</p>
      </div>
    );
  }

  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;
  const isLastQuestion = quiz ? currentQuestion === quiz.questions.length - 1 : false;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((curr) => curr - 1);
    }
  };

  const handleConfirmedSubmit = async () => {
    try {
      const response = await submitQuiz({
        variables: {
          quizId,
          answers: selectedAnswers,
        },
      });

      setShowConfirmDialog(false);
      navigate('/quiz-results', {
        state: {
          score: response.data.submitQuiz.score,
          totalQuestions: questions.length,
          answers: selectedAnswers,
          questions: questions,
          quizTitle: quiz?.title,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  return (
    <>
      <div className='min-h-screen bg-slate-100 flex flex-col'>
        <div className='fixed top-6 left-0 right-0 z-10'>
          <div className='text-lg text-gray-700 text-center font-semibold'>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        <div className='flex-1 flex flex-col items-center justify-center p-4 pt-16'>
          {/* Question Card */}
          {questions && questions.length > 0 && questions[currentQuestion] ? (
            <Card className='w-full max-w-4xl p-6 mb-8'>
              <h2 className='text-2xl font-bold text-center mb-8'>
                {questions[currentQuestion].question}
              </h2>

              {/* Options Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg text-lg font-medium transition-all
                    ${
                      selectedAnswers[currentQuestion] === index
                        ? 'bg-blue-500 text-white hover:bg-blue-600' // Selected state
                        : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border border-slate-200' // Unselected state
                    }
                  `}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            <div>No questions available</div>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className='sticky bottom-0 bg-white border-t'>
          <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
            {/* Previous Button */}
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Previous
            </Button>

            {/* Progress Bar */}
            <div className='flex-1 mx-8 max-w-md'>
              <Progress value={progress} className='h-2' />
              <p className='text-center text-sm text-gray-500 mt-1'>
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Next/Submit Button */}
            {isLastQuestion ? (
              <Button
                onClick={() => setShowConfirmDialog(true)}
                className='flex items-center gap-2'
                disabled={selectedAnswers.length !== questions.length}
              >
                Submit Quiz
                <Send className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className='flex items-center gap-2'
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmedSubmit}
        title='Submit Quiz?'
        description='Are you sure you want to submit your answers? You cannot change them after submission.'
        isLoading={submitting}
        confirmButtonText='Submit Quiz'
      >
        <div>
          <h4 className='font-medium mb-2'>Quiz Summary:</h4>
          <ul className='text-sm space-y-1 text-gray-600'>
            <li>• Total Questions: {questions.length}</li>
            <li>• Answered Questions: {selectedAnswers.filter((a) => a !== undefined).length}</li>
            <li>
              • Unanswered Questions:{' '}
              {questions.length - selectedAnswers.filter((a) => a !== undefined).length}
            </li>
          </ul>
        </div>
      </ConfirmationDialog>
    </>
  );
};

export default QuizView;
