import { gql } from '@apollo/client';

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($userId: ID!, $quizId: ID!, $answers: [Int!]!, $isRecommended: Boolean) {
    submitQuiz(userId: $userId, quizId: $quizId, answers: $answers, isRecommended: $isRecommended) {
      id
      success
      message
      cluster
      questions {
        prompt
        options
        correctAnswer
      }
    }
  }
`;
