import { gql } from '@apollo/client';

export const SUBMIT_QUIZ = gql`
  mutation SubmitQuiz($quizId: String!, $answers: [Int!]!) {
    submitQuiz(quizId: $quizId, answers: $answers) {
      score
    }
  }
`;