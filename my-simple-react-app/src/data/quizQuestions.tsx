// src/data/quizQuestions.ts
export interface Question {
    question: string;
    options: string[];
    answer: string;
  }
  
  export const quizQuestions: Question[] = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Rome", "Madrid"],
      answer: "Paris"
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Leonardo da Vinci", "Vincent Van Gogh", "Pablo Picasso", "Claude Monet"],
      answer: "Leonardo da Vinci"
    }
  ];
  