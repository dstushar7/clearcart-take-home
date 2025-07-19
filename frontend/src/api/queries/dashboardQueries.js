// src/api/queries/dashboardQueries.js

import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    dashboard {
      bought {
        id
        name
        description
        status
        priceForSale
        owner {
          id
          firstName
        }
      }
      sold {
        id
        name
        description
        status
        priceForSale
      }
      rented {
        id
        name
        description
        status
        priceForRent
        owner {
          id
          firstName
        }
      }
      lent {
        id
        name
        description
        status
        priceForRent
      }
    }
  }
`;