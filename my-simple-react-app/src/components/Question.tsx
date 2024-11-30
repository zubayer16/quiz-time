import React from 'react';

function Question({ question, onAnswer }: { question: any, onAnswer: any }) {
    return (
        <div>
            <h2>{question.questionText}</h2>
            {question.answerOptions.map((option: any, index: number) => (
            <button key={index} onClick={() => onAnswer(option.isCorrect)}>
                {option.answerText}
            </button>
            ))}
        </div>
    );
}

export default Question;
