import UserResolvers from "#graphql/User/resolvers";
import ApiKeyResolvers from "#graphql/ApiKey/resolvers";
import ProductResolvers from "#graphql/Product/resolvers";

import CharactersticScalarResolver from "#graphql/Scalars/Characteristic";

export default [
  CharactersticScalarResolver,
  UserResolvers,
  ApiKeyResolvers,
  ProductResolvers,
];
