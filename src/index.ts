import { ApolloServer } from "@apollo/server";
import { applyMiddleware } from "graphql-middleware";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import http from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

import typeDefs from "#graphql/typeDefs";
import resolvers from "#graphql/resolvers";
import { createContext } from "#utils/context";
import { prismaSelectMiddleware } from "#middlewares/select";
import { permissions } from "#middlewares/shield";
import { apiRouter } from "#routes/api";
import { startGrpcServer } from "#grpc/server";

import { ENV } from "#utils/config";

(async () => {
  let schema = makeExecutableSchema({ typeDefs, resolvers });
  schema = applyMiddleware(schema, prismaSelectMiddleware, permissions);

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ENV.IS_DEV
        ? ApolloServerPluginLandingPageLocalDefault()
        : ApolloServerPluginLandingPageDisabled(),
    ],
    introspection: ENV.GRAPHQL_API_INTROSPECTION,
    csrfPrevention: true,
    includeStacktraceInErrorResponses: ENV.IS_DEV,
  });

  await server.start();

  app.use(
    cors<cors.CorsRequest>({
      origin: ENV.CORS,
    }),
  );
  if (ENV.GRAPHQL_API_ENABLED) {
    app.use(
      ENV.GRAPHQL_API_PATH,
      express.json(),
      expressMiddleware(server, {
        context: createContext,
      }),
    );
  }

  if (ENV.REST_API_ENABLED) {
    app.use(ENV.REST_API_PATH, express.json(), apiRouter);
  }

  app.use("/*splat", (_, res) => {
    res.status(404).send("Not Found");
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: ENV.PORT }, resolve),
  );
  console.log(`🚀 Server ready at http://localhost:${ENV.PORT}/`);
  if (ENV.GRPC_API_ENABLED) {
    startGrpcServer();
  }
})();
