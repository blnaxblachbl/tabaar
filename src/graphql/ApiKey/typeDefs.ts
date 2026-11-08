import gql from "graphql-tag";

export default gql`
  type ApiKey {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    key: String!
    name: String!
    expiredAt: DateTime
  }
  type ApiKeysResult {
    apiKeys: [ApiKey!]!
    apiKeysCount: Int!
  }
  type Query {
    findApiKeys(skip: Int, take: Int): ApiKeysResult!
    findOneApiKey(id: Int!): ApiKey!
  }
  type Mutation {
    createApiKey(data: CreateApiKeyInput!): ApiKey!
    updateApiKey(id: Int!, data: UpdateApiKeyInput!): ApiKey!
    deleteApiKey(id: Int!): ApiKey!
  }
`;
