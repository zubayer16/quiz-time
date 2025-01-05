import React, { useState } from 'react';
import './AdminPanel.css';

type Question = {
    id: number;
    question: string;
    options: string[];
    answer: string;
};

type Quiz = {
    id: number;
    title: string;
    description: string;
    questions: Question[];
};

function AdminPanel() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([
        {
            id: 1,
            title: "Math Basics",
            description: "A simple quiz covering basic math concepts.",
            questions: [
                {
                    id: 101,
                    question: "What is 2 + 2?",
                    options: ["3", "4", "5", "6"],
                    answer: "4"
                },
                {
                    id: 102,
                    question: "What is the square root of 16?",
                    options: ["2", "4", "6", "8"],
                    answer: "4"
                }
            ]
        },
        {
            id: 2,
            title: "General Knowledge",
            description: "Test your knowledge on various topics.",
            questions: [
                {
                    id: 201,
                    question: "What is the capital of France?",
                    options: ["Paris", "London", "Berlin", "Rome"],
                    answer: "Paris"
                },
                {
                    id: 202,
                    question: "Which planet is known as the Red Planet?",
                    options: ["Earth", "Mars", "Venus", "Jupiter"],
                    answer: "Mars"
                }
            ]
        }
    ]);

    const [showModal, setShowModal] = useState<'add' | 'edit' | 'view' | null>(null);
    const [newQuiz, setNewQuiz] = useState<Quiz>({
        id: 0,
        title: '',
        description: '',
        questions: [{ id: 0, question: '', options: ['', '', '', ''], answer: '' }]
    });
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    const handleAddQuiz = () => {
        setQuizzes([
            ...quizzes,
            { ...newQuiz, id: quizzes.length + 1 }
        ]);
        setShowModal(null);
    };

    const handleEditQuiz = () => {
        setQuizzes(
            quizzes.map((quiz) =>
                quiz.id === newQuiz.id ? { ...newQuiz } : quiz
            )
        );
        setShowModal(null);
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, questionId: number) => {
        const { value } = e.target;
        const updatedQuestions = newQuiz.questions.map((q) =>
            q.id === questionId ? { ...q, [field]: value } : q
        );
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, questionId: number, optionIndex: number) => {
        const { value } = e.target;
        const updatedQuestions = newQuiz.questions.map((q) => {
            if (q.id === questionId) {
                const updatedOptions = [...q.options];
                updatedOptions[optionIndex] = value;
                return { ...q, options: updatedOptions };
            }
            return q;
        });
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: newQuiz.questions.length + 1,
            question: '',
            options: ['', '', '', ''],
            answer: ''
        };
        setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, newQuestion] });
    };

    const handleDeleteQuiz = (quizId: number) => {
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    };

    return (
        <div className="admin-panel-container">
            <h1>Admin Panel</h1>
            <button
                className="add-quiz-button"
                onClick={() => setShowModal('add')}
            >
                Add New Quiz
            </button>

            {/* Quiz List */}
            <div className="quiz-list">
                <h2>Existing Quizzes</h2>
                {quizzes.length === 0 ? (
                    <p>No quizzes added yet.</p>
                ) : (
                    <table className="quiz-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <tr key={quiz.id}>
                                    <td>{quiz.title}</td>
                                    <td>{quiz.description}</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedQuiz(quiz);
                                                setShowModal('view');
                                            }}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => {
                                                setNewQuiz(quiz);
                                                setShowModal('edit');
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteQuiz(quiz.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Quiz Modal */}
            {showModal === 'add' && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Quiz</h2>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={newQuiz.title}
                                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newQuiz.description}
                                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                            />
                        </label>
                        <h3>Questions</h3>
                        {newQuiz.questions.map((q) => (
                            <div key={q.id} className="question-form">
                                <label>
                                    Question:
                                    <input
                                        type="text"
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(e, 'question', q.id)}
                                    />
                                </label>
                                <label>
                                    Answer:
                                    <input
                                        type="text"
                                        value={q.answer}
                                        onChange={(e) => handleQuestionChange(e, 'answer', q.id)}
                                    />
                                </label>
                                <h4>Options</h4>
                                {q.options.map((option, index) => (
                                    <div key={index} className="option-input">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(e, q.id, index)} // Update the option for this question
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button onClick={handleAddQuiz}>Add Quiz</button>
                        <button onClick={() => setShowModal(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Quiz Modal */}
            {showModal === 'edit' && newQuiz.id !== 0 && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Quiz</h2>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={newQuiz.title}
                                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={newQuiz.description}
                                onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                            />
                        </label>
                        <h3>Questions</h3>
                        {newQuiz.questions.map((q) => (
                            <div key={q.id} className="question-form">
                                <label>
                                    Question:
                                    <input
                                        type="text"
                                        value={q.question}
                                        onChange={(e) => handleQuestionChange(e, 'question', q.id)}
                                    />
                                </label>
                                <label>
                                    Answer:
                                    <input
                                        type="text"
                                        value={q.answer}
                                        onChange={(e) => handleQuestionChange(e, 'answer', q.id)}
                                    />
                                </label>
                                <h4>Options</h4>
                                {q.options.map((option, index) => (
                                    <div key={index} className="option-input">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(e, q.id, index)} // Update the option for this question
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button onClick={handleEditQuiz}>Save Changes</button>
                        <button onClick={() => setShowModal(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* View Quiz Modal */}
            {showModal === 'view' && selectedQuiz && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedQuiz.title}</h2>
                        <p>{selectedQuiz.description}</p>
                        <h3>Questions</h3>
                        <ul>
                            {selectedQuiz.questions.map((q) => (
                                <li key={q.id}>
                                    <strong>{q.question}</strong>
                                    <ul>
                                        {q.options.map((option, index) => (
                                            <li key={index}>{option}</li>
                                        ))}
                                    </ul>
                                    <p>Answer: {q.answer}</p>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowModal(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPanel;
