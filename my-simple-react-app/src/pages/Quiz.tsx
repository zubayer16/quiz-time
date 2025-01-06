import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import categories from '../utils/categories';
import '../pages/Quiz.css';
import { useQuery } from '@apollo/client';
import { GET_QUIZZES } from '../graphql/queries/quiz';

function Quiz() {
    const { loading, error, data } = useQuery(GET_QUIZZES);
    const [quizzes, setQuizzes] = useState([]);
    
    useEffect(() => {
        if (data) {
            setQuizzes(data.quizzes);
        }
    }, [data]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="quiz-container">
            <h1>Select a Category</h1>
            <div className="category-grid">
                {categories.map((category, index) => (
                    <Link key={index} to={category.path} className="category-card">
                        <img src={category.image} alt={category.name} className="category-image"/>
                        <div className="category-content">
                            <h2>{category.name}</h2>
                            <p>{category.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Quiz;
