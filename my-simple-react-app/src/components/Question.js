import React from 'react';

function Question({ question, onAnswer }) {
    return (
        <div>
            <h2>{question.questionText}</h2>
            {question.answerOptions.map((option, index) => (
                <button key={index} onClick={() => onAnswer(option.isCorrect)}>
                    {option.answerText}
                </button>
            ))}
        </div>
    );
}

export default Question;
