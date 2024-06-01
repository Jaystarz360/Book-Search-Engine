// Importing the gql tag from Apollo Client to parse GraphQL queries
import { gql } from "@apollo/client";

// Defining the GraphQL query to fetch the current user's data
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`;
