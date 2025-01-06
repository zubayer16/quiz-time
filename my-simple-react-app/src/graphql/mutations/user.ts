import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    )
  }
`;
