import gql from "graphql-tag";

export default gql`
  input CreateUserInput {
    email: String!
    name: String!
  }
  input UpdateUserInput {
    name: String
    email: String
  }
  input LoginUserInput {
    email: String!
    password: String!
  }
  input RefreshTokenInput {
    refreshToken: String!
  }
`;
