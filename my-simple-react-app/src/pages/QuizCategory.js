import React, { useState } from 'react';
import questions from '../utils/questions';
import { useNavigate } from 'react-router-dom';

function QuizCategory({ category }) {
    const navigate = useNavigate();
    const categoryQuestions = questions.filter(q => q.category === category);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const handleAnswer = (isCorrect) => {
        if (isCorrect) {
            setScore(score + 1);
        }

        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < categoryQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setShowResults(true);
        }
    };

    return (
        <div>
            {showResults ? (
                <div>
                    <h2>You scored {score} out of {categoryQuestions.length}</h2>
                    <button onClick={() => navigate('/')}>Go to Home</button>
                </div>
            ) : (
                <div>
                    <h1>{category} Quiz</h1>
                    <p>{categoryQuestions[currentQuestionIndex].questionText}</p>
                    <ul>
                        {categoryQuestions[currentQuestionIndex].answerOptions.map((option, index) => (
                            <li key={index}>
                                <button onClick={() => handleAnswer(option.isCorrect)}>
                                    {option.answerText}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default QuizCategory;
