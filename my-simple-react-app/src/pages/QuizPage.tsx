import React, { useState, useEffect } from 'react';
import { quizQuestions, Question } from '../data/quizQuestions';
import Timer from '../components/Timer';  // Ensure this path is correct
import Header from '../components/layouts/Header';  // Ensure this path is correct

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(30); // Total time for the quiz in seconds

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        handleTimeUp();
      }
    }, 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleTimeUp = () => {
    alert("Time's up!");
    calculateResults();
  };

  const calculateResults = () => {
    const score = quizQuestions.reduce((acc, question, index) => {
      if (selectedAnswers[index] === question.answer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    alert(`Your score is ${score} out of ${quizQuestions.length}`);
  };

  const question = quizQuestions[currentQuestionIndex];

  return (
    <div>
      <Header />  
      <h1>Quiz Time</h1>
      <Timer initialTime={timeLeft} onTimeUp={handleTimeUp} /> 
      
     
      
    </div>
  );
};

export default QuizPage;
