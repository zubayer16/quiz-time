import { gql } from '@apollo/client';
export const GET_USER_STATS = gql`
  query GetUserStats($userId: ID!) {
    getUserStats(userId: $userId) {
      totalScore
      quizzesCompleted
      averageScore
      lastQuizDate
    }
  }
`;
