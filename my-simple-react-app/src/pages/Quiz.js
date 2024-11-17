import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../utils/categories'; // Ensure the path matches your project structure
import '../pages/Quiz.css'; // Assuming you will add CSS here

function Quiz() {
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
