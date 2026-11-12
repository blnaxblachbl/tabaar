import {
  ServiceClientConstructor,
  loadPackageDefinition,
  Server,
} from "@grpc/grpc-js";
import { type PackageDefinition } from "@grpc/proto-loader";

import { getProducts } from "./callbacks/getProducts";
import { scrollProducts } from "./callbacks/scrollProduct";
import { getOneProduct } from "./callbacks/getOneProduct";
import { createProduct } from "./callbacks/createProduct";
import { updateProduct } from "./callbacks/updateProduct";
import { deleteProduct } from "./callbacks/deleteProduct";
import { appendVariant } from "./callbacks/appendVariant";
import { updateVariant } from "./callbacks/updateVariant";
import { deleteVariant } from "./callbacks/deleteVariant";
import { getArchivedProducts } from "./callbacks/getArchivedProducts";
import { scrollArchivedProducts } from "./callbacks/scrollArchivedProduct";
import { restoreProduct } from "./callbacks/restoreProduct";

export function productService(server: Server, definition: PackageDefinition) {
  const proto = loadPackageDefinition(definition);

  server.addService(
    (proto.ProductService as ServiceClientConstructor).service,
    {
      getProducts,
      getArchivedProducts,
      scrollProducts,
      scrollArchivedProducts,
      getOneProduct,
      createProduct,
      updateProduct,
      deleteProduct,
      appendVariant,
      updateVariant,
      deleteVariant,
      restoreProduct,
    },
  );
}
