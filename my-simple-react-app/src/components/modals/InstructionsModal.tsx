import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { ClipboardList, Clock, AlertCircle } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRecommended?: boolean;
  isTimedQuiz?: boolean;
  quiz: {
    id: string;
    title: string;
    description: string;
    isTimedQuiz?: Boolean;
    quizTime?: number;
  };
}

const InstructionsModal = ({
  isOpen,
  onClose,
  quiz,
  isRecommended,
  isTimedQuiz,
}: InstructionsModalProps) => {
  const navigate = useNavigate();

  console.log(isTimedQuiz);

  const startQuiz = () => {
    onClose();
    if (isTimedQuiz) {
      navigate(`/timed-quiz/${quiz.id}`);
    } else {
      navigate(`/quiz/${quiz.id}`, {
        state: { isRecommended },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Quiz Instructions</DialogTitle>
          <DialogDescription className='py-2'>
            Please read the following instructions carefully before starting the quiz
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='flex items-center space-x-3'>
            <ClipboardList className='h-5 w-5 text-blue-500' />
            <div>
              <p className='font-medium'>Quiz Details</p>
              <p className='text-sm text-gray-500'>
                10 questions • {quiz.isTimedQuiz ? quiz.quizTime + ' minutes' : 'No time limit'}
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <Clock className='h-5 w-5 text-yellow-500 mt-0.5' />
              <div>
                <p className='font-medium'>Time Limit</p>
                <p className='text-sm text-gray-500'>
                  {quiz.isTimedQuiz
                    ? 'This quiz has a fixed duration. The timer will start once you begin.'
                    : 'This quiz has no time limit. But challenge yourself and complete it faster.'}
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
              <div>
                <p className='font-medium'>Important Rules</p>
                {quiz.isTimedQuiz ? (
                  <ul className='text-sm text-gray-500 list-disc pl-4 space-y-1'>
                    <li>The quiz must be completed within time duration.</li>
                    <li>You should answer for all the questions in order to submit the quiz.</li>
                    <li>
                      You can't skip the questions. But you can go back and change your answers.
                    </li>
                    <li>The quiz will be automatically submitted when the time runs out.</li>
                    <li>Ensure stable internet connection</li>
                    <li>Do not refresh or leave the page</li>
                  </ul>
                ) : (
                  <ul className='text-sm text-gray-500 list-disc pl-4 space-y-1'>
                    <li>You should answer for all the questions in order to submit the quiz.</li>
                    <li>
                      You can't skip the questions. But you can go back and change your answers.
                    </li>

                    <li>Ensure stable internet connection</li>
                    <li>Do not refresh or leave the page</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className='flex space-x-3 sm:space-x-2'>
          <Button
            variant='outline'
            onClick={onClose}
            className='text-gray-800 bg-slate-300 hover:bg-slate-400 hover:text-gray-200'
          >
            Cancel
          </Button>
          <Button onClick={startQuiz}>Start Quiz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;
