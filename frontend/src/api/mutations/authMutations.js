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