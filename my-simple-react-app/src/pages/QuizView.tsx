import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, ArrowRight, Send, X } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_QUIZ_BY_ID } from '../graphql/queries/quiz';
import { SUBMIT_QUIZ } from '../graphql/mutations/quiz';
import ConfirmationDialog from '../components/modals/ConfirmationDialogModal';
import { useAuth } from '../context/AuthContext';

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
  questions: Question[];
}

interface QuizSessionData {
  quizId: string;
  currentQuestion: number;
  answers: number[];
}

const QuizView = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quiz, setQuiz] = useState<Quiz>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [submitQuiz, { loading: submitting }] = useMutation(SUBMIT_QUIZ);
  const navigate = useNavigate();
  const { userId } = useAuth();
  const isRecommended = location.state?.isRecommended;

  const { loading, error, data } = useQuery(GET_QUIZ_BY_ID, {
    variables: { quizId, isRecommended },
  });

  // Session storage functions
  const storeQuizSession = useCallback(() => {
    const sessionData: QuizSessionData = {
      quizId: quizId as string,
      currentQuestion,
      answers: selectedAnswers,
    };
    localStorage.setItem(`quiz_session_${quizId}`, JSON.stringify(sessionData));
  }, [quizId, currentQuestion, selectedAnswers]);

  const getQuizSession = useCallback(() => {
    const sessionData = localStorage.getItem(`quiz_session_${quizId}`);
    if (!sessionData) return null;

    const session: QuizSessionData = JSON.parse(sessionData);
    if (session.quizId !== quizId) {
      localStorage.removeItem(`quiz_session_${quizId}`);
      return null;
    }

    return session;
  }, [quizId]);

  const clearQuizSession = useCallback(() => {
    localStorage.removeItem(`quiz_session_${quizId}`);
  }, [quizId]);

  // Handle quit
  const handleQuit = () => {
    clearQuizSession();
    navigate('/home');
  };

  // Initialize quiz and restore session
  useEffect(() => {
    if (data?.quiz) {
      setQuiz(data.quiz);
      setQuestions(data.quiz.questions || []);

      // Check for existing session
      const existingSession = getQuizSession();
      if (existingSession) {
        setCurrentQuestion(existingSession.currentQuestion);
        setSelectedAnswers(existingSession.answers);
      }
    }
  }, [data, getQuizSession]);

  // Save session when answers or current question changes
  useEffect(() => {
    if (selectedAnswers.length > 0 || currentQuestion > 0) {
      storeQuizSession();
    }
  }, [selectedAnswers, currentQuestion, storeQuizSession]);

  const answeredQuestionsCount = selectedAnswers.filter((answer) => answer !== undefined).length;
  const progress = quiz ? (answeredQuestionsCount / quiz.questions.length) * 100 : 0;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleConfirmedSubmit = async () => {
    try {
      const response = await submitQuiz({
        variables: {
          userId,
          quizId,
          answers: selectedAnswers,
          isRecommended,
        },
      });

      clearQuizSession();
      setShowConfirmDialog(false);

      if (response.data.submitQuiz.success) {
        const submissionId = response.data.submitQuiz.id;
        navigate(`/quiz-results/${submissionId}`, { state: { isRecommended } });
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

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

  return (
    <>
      <div className='min-h-screen bg-slate-100 flex flex-col'>
        <header className='sticky top-0 bg-white border-b'>
          <div className='w-full bg-white py-2 px-6'>
            <div className='max-w-5xl mx-auto'>
              <div className='flex items-center justify-between mb-4'>
                {/* Quiz Title and Navigation */}
                <div className='flex items-center gap-4'>
                  <h1 className='text-xl font-semibold text-gray-800'>{quiz?.title || 'Quiz'}</h1>
                </div>

                <div className='py-2 flex justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setShowQuitDialog(true)}
                    className='text-red-500 hover:bg-red-500 hover:text-slate-200'
                  >
                    <X className='h-4 w-4 mr-1' />
                    Quit Quiz
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-1'>
                  <Progress value={progress} className='h-2' />
                </div>
                <span className='text-sm text-gray-500 min-w-[100px]'>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-auto py-8'>
          <div className='max-w-4xl mx-auto px-6'>
            {questions[currentQuestion] && (
              <Card className='w-full p-6 mb-8'>
                <h2 className='text-2xl font-bold text-center mb-8'>
                  {questions[currentQuestion].question}
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-lg text-lg font-medium transition-all ${
                        selectedAnswers[currentQuestion] === index
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border border-slate-200'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </main>

        <footer className='sticky bottom-0 bg-white border-t'>
          <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Previous
            </Button>

            <div className='flex-1 mx-8 max-w-md'>
              <Progress value={progress} className='h-2' />
              <p className='text-center text-sm text-gray-500 mt-1'>
                {Math.round(progress)}% Complete
              </p>
            </div>

            {isLastQuestion ? (
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={selectedAnswers.length !== questions.length}
                className='flex items-center gap-2'
              >
                Submit Quiz
                <Send className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className='flex items-center gap-2'
              >
                Next
                <ArrowRight className='h-4 w-4' />
              </Button>
            )}
          </div>
        </footer>

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
              {/*<li>
                • Unanswered Questions:{' '}
                {questions.length - selectedAnswers.filter((a) => a !== undefined).length}
              </li>*/}
            </ul>
          </div>
        </ConfirmationDialog>

        <ConfirmationDialog
          isOpen={showQuitDialog}
          onClose={() => setShowQuitDialog(false)}
          onConfirm={handleQuit}
          title='Quit Quiz?'
          description='Are you sure you want to quit? Your progress will be lost.'
          confirmButtonText='Yes, Quit Quiz'
          confirmButtonVarient='destructive'
        />
      </div>
    </>
  );
};

export default QuizView;
