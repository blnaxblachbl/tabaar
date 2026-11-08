import path from "path";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";

import { addUserService } from "#grpc/services/userService";
import { addApiKeyService } from "#grpc/services/apiKeyService";
import { productService } from "./services/productService";
import { ENV } from "#utils/config";

export function startGrpcServer() {
  const server = new Server();
  const packageDefinition = loadSync(
    [
      path.join(__dirname, "./protos/user.proto"),
      path.join(__dirname, "./protos/apiKey.proto"),
      path.join(__dirname, "./protos/product.proto"),
    ],
    {},
  );

  addUserService(server, packageDefinition);
  addApiKeyService(server, packageDefinition);
  productService(server, packageDefinition);

  if (ENV.GRPC_API_REFLECTION) {
    const reflection = new ReflectionService(packageDefinition);
    reflection.addToServer(server);
  }

  server.bindAsync(
    `0.0.0.0:${ENV.GRPC_PORT}`,
    ServerCredentials.createInsecure(),
    () => {
      console.log(`🚀 gRPC Server started on localhost:${ENV.GRPC_PORT}`);
    },
  );
}
