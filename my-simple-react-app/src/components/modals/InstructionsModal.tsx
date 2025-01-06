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
  quiz: {
    id: string;
    title: string;
    description: string;
  };
}

const InstructionsModal = ({ isOpen, onClose, quiz, isRecommended }: InstructionsModalProps) => {
  const navigate = useNavigate();

  const startQuiz = () => {
    onClose();
    navigate(`/quiz/${quiz.id}`, {
      state: { isRecommended },
    });
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
              <p className='text-sm text-gray-500'>10 questions • 45 minutes</p>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <Clock className='h-5 w-5 text-yellow-500 mt-0.5' />
              <div>
                <p className='font-medium'>Time Limit</p>
                <p className='text-sm text-gray-500'>
                  Each quiz has a fixed duration. The timer will start once you begin.
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <AlertCircle className='h-5 w-5 text-red-500 mt-0.5' />
              <div>
                <p className='font-medium'>Important Rules</p>
                <ul className='text-sm text-gray-500 list-disc pl-4 space-y-1'>
                  <li>You cannot pause the timer once started</li>
                  <li>Each question can only be answered once</li>
                  <li>Ensure stable internet connection</li>
                  <li>Do not refresh or leave the page</li>
                </ul>
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
