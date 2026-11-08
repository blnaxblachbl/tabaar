import { mergeTypeDefs } from "@graphql-tools/merge";

import UserTypeDefs from "#graphql/User/typeDefs";
import ApiKeyTypeDefs from "#graphql/ApiKey/typeDefs";
import ProductTypeDefs from "#graphql/Product/typeDefs";

import GlobalInputTypes from "#graphql/inputTypes";
import UserInputTypes from "#graphql/User/inputTypes";
import ApiKeyInputTypes from "#graphql/ApiKey/inputTypes";
import ProductInputTypes from "#graphql/Product/inputTypes";

const InputTypes = mergeTypeDefs([
  GlobalInputTypes,
  UserInputTypes,
  ApiKeyInputTypes,
  ProductInputTypes,
]);

export default mergeTypeDefs([
  InputTypes,
  UserTypeDefs,
  ApiKeyTypeDefs,
  ProductTypeDefs,
]);
