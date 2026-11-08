import gql from "graphql-tag";

export default gql`
  scalar DateTime
  scalar Json
  scalar Characterstic

  input IntRangeInput {
    lte: Int
    gte: Int
  }
  input FloatRangeInput {
    lte: Float
    gte: Float
  }
`;
