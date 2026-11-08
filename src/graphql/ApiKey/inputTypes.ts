import gql from "graphql-tag";

export default gql`
  input CreateApiKeyInput {
    name: String!
    expiredAt: DateTime!
  }
  input UpdateApiKeyInput {
    name: String
    expiredAt: DateTime
  }
`;
