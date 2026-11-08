import { GraphQLScalarType, Kind, valueFromASTUntyped } from "graphql";
import z from "zod";

const charactersticSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export const CharactersticScalar = new GraphQLScalarType({
  name: "Characterstic",
  description: "Characterstic custom JSON scalar type",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    const { success, data } = charactersticSchema.safeParse(value);
    if (!success) {
      throw Error(
        "GraphQL Characterstic Scalar value serializer expected a `string`, `number`, or `boolean`",
      );
    }
    return data;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      const value = valueFromASTUntyped(ast);
      const { success, data } = charactersticSchema.safeParse(value);
      if (!success) {
        throw Error(
          "GraphQL Characterstic Scalar value serializer expected a `string`, `number`, or `boolean`",
        );
      }
      return data;
    } else {
      throw Error(
        "GraphQL Characterstic Scalar should be an object",
      );
    }
  },
});

export default {
  Characterstic: CharactersticScalar,
};
