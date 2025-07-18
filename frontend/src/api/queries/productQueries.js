import { gql } from '@apollo/client';

// Define the GraphQL queries for products
export const MY_PRODUCTS_QUERY = gql`
  query MyProducts {
    myProducts {
      id
      name
      description
      priceForRent
      priceForSale
      status
      createdAt
      categories {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      priceForRent
      priceForSale
      status
      categories {
        id
        name
      }
    }
  }
`;


export const GET_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;