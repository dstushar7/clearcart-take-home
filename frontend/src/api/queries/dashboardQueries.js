// src/api/queries/dashboardQueries.js

import { gql } from '@apollo/client';

const PRODUCT_CARD_FIELDS = gql`
  fragment ProductCardFields on Product {
    id
    name
    description
    status
    priceForSale
    priceForRent
    createdAt
    categories {
      id
      name
    }
    owner {
      id
      firstName
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  # Include the fragment definition here
  ${PRODUCT_CARD_FIELDS}

  query GetDashboardData {
    dashboard {
      bought {
        ...ProductCardFields
      }
      sold {
        ...ProductCardFields
      }
      rented {
        ...ProductCardFields
      }
      lent {
        ...ProductCardFields
      }
    }
  }
`;