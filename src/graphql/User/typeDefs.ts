import gql from "graphql-tag";

export default gql`
  type User {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    email: String!
  }
  type FindUsersResult {
    users: [User!]!
    usersCount: Int!
  }
  type LoginUserResult {
    user: User!
    accessToken: String!
    refreshToken: String!
  }
  type Query {
    findUsers(skip: Int, take: Int): FindUsersResult!
    findOneUser(id: Int!): User!
    findMe: User
  }
  type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(id: Int!, data: UpdateUserInput!): User!
    loginUser(data: LoginUserInput!): LoginUserResult!
    refreshToken(data: RefreshTokenInput!): LoginUserResult!
    deleteUser(id: Int!): User!
  }
`;
