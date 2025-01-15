import { gql } from '@apollo/client';

export const GET_QUIZZES = gql`
  query GetQuizzes($isTimedQuiz: Boolean) {
    quizzes(isTimedQuiz: $isTimedQuiz) {
      id
      title
      description
      isTimedQuiz
      quizTime
      questions {
        question
        options
        correctAnswer
      }
    }
  }
`;

export const GET_QUIZ_BY_ID = gql`
  query GetQuizById($quizId: String!, $isRecommended: Boolean) {
    quiz(id: $quizId, isRecommended: $isRecommended) {
      id
      title
      description
      isTimedQuiz
      quizTime
      questions {
        question
        options
      }
    }
  }
`;

export const GET_QUIZ_RESULT = gql`
  query GetQuizResult($submissionId: ID!, $userId: ID!, $isRecommended: Boolean) {
    getQuizResult(submissionId: $submissionId, userId: $userId, isRecommended: $isRecommended) {
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

export const GET_RECOMMENDED_QUIZ = gql`
  query GetRecommendedQuiz($userId: ID!) {
    recommendedQuiz(userId: $userId) {
      id
      questions {
        question
        options
      }
    }
  }
`;
