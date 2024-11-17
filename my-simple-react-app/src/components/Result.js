import React from 'react';

function Result({ isCorrect }) {
    return (
        <div>
            {isCorrect ? <p>Correct!</p> : <p>Wrong!</p>}
        </div>
    );
}

export default Result;
