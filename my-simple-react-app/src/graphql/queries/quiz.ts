import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
  query GetQuizzes {
    quizzes {
      id
      title
      description
      questions {
        question
        options
        correctAnswer
      }
    }
  }
`;

export const GET_QUIZ_BY_ID = gql`
  query GetQuizById($quizId: String!) {
    quiz(id: $quizId) {
      id
      title
      description
      questions {
        question
        options
      }
    }
  }
`;

export const GET_QUIZ_RESULT = gql`
  query GetQuizResult($submissionId: ID!, $userId: ID!) {
    getQuizResult(submissionId: $submissionId, userId: $userId) {
      score
      answers
      submittedAt
      quiz {
        title
        questions {
          question
          options
          correctAnswer
        }
      }
    }
  }
`;
