import { gql } from '@apollo/client';

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($userId: ID!, $quizId: ID!, $answers: [Int!]!) {
    submitQuiz(userId: $userId, quizId: $quizId, answers: $answers) {
      id
      success
      message
    }
  }
`;
