import { gql } from "graphql-tag";

export default gql`
  type Product {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: [LocaleContent!]!
    description: [LocaleContent!]!
    characterstics: Characterstic
    variants: [Variant!]!
    minPrice: Float!
    maxPrice: Float!
    available: Boolean!
  }
  type LocaleContent {
    locale: String!
    content: String!
  }
  type Variant {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    characterstics: Characterstic!
    price: Float!
    count: Int!
    currency: String!
    images: [String!]!
  }
  type ProductResult {
    products: [Product!]!
    productsCount: Int!
    scrollId: String!
  }
  type Query {
    findProducts(
      query: String
      take: Int
      filters: FiltersInput
    ): ProductResult!
    scrollProducts(scrollId: String): ProductResult!
    findOneProduct(id: String): Product!
  }
  type Mutation {
    createProduct(data: CreateProductInput!): Product!
    updateProduct(id: String!, data: UpdateProductInput!): Product!
    deleteProduct(id: String!): Product!
    appendVariant(id: String!, data: CreateVariantInput!): Product!
    deleteVariant(id: String!, variantId: String!): Product!
    updateVariant(
      id: String!
      variantId: String!
      data: UpdateVariantInput!
    ): Product!
  }
`;
