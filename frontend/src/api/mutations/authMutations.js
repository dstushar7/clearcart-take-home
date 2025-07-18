import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    register(input: $input) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;