import gql from "graphql-tag";

export default gql`
  input LocaleContentInput {
    locale: String!
    content: String!
  }
  input CreateProductInput {
    name: [LocaleContentInput!]!
    description: [LocaleContentInput!]!
    characterstics: Characterstic
  }
  input UpdateProductInput {
    name: [LocaleContentInput!]
    description: [LocaleContentInput!]
    characterstics: Characterstic
  }
  input CreateVariantInput {
    characterstics: Characterstic!
    price: Float!
    count: Int!
    currency: String!
  }
  input UpdateVariantInput {
    characterstics: Characterstic
    price: Float
    count: Int
    currency: String
  }
  input FiltersInput {
    available: Boolean
    minPrice: FloatRangeInput
    maxPrice: FloatRangeInput
    characterstics: Characterstic
    variants: VariantFilterInput
  }
  input VariantFilterInput {
    characterstics: Characterstic
    currency: String
    price: FloatRangeInput
    count: IntRangeInput
  }
  input UpdateVariantsCountInput {
    "Product ID"
    id: String!
    "Variant ID"
    variantId: String!
    "Pass a value greater than 0 to increase, or a value less than 0 to decrease."
    value: Int!
  }
`;
