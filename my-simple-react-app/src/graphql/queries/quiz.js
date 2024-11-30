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