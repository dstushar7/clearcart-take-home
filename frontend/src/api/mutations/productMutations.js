import { gql } from '@apollo/client';

// This mutation matches your 'deleteProduct' resolver.
// Note that the variable is 'id' and its type is 'ID!'.
export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id # Request the ID back to confirm success
    }
  }
`;