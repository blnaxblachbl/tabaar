import express from "express";
import multer from "multer";

import { getProducts } from "./get";
import { createProduct } from "./post";
import { getProductsByScrollId } from "./scroll/get";
import { getProductById } from "./id/get";
import { updateProductById } from "./id/put";
import { deleteProductById } from "./id/delete";
import { appendVariant } from "./id/variant/post";
import { updateVariant } from "./id/variant/id/put";
import { deleteVariant } from "./id/variant/id/delete";
import { bulkCreate } from "./bulk/post";
import { ENV } from "#utils/config";

const productRouter = express.Router();
const productPublicRouter = express.Router();

const upload = multer({
  limits: {
    fileSize: ENV.MAX_JSON_UPLOAD_SIZE,
  },
  fileFilter(_req, file, callback) {
    if (file.mimetype !== "application/json") {
      return callback(new Error("Only JSON type of file is allowed"));
    }
    callback(null, true);
  },
});

productPublicRouter.get("/", getProducts);
productPublicRouter.get("/scroll", getProductsByScrollId);
productPublicRouter.get("/:id", getProductById);

productRouter.post("/", createProduct);
productRouter.post("/bulk", upload.single("file"), bulkCreate);
productRouter.put("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);
productRouter.post("/:id/variant", appendVariant);
productRouter.put("/:id/variant/:variantId", updateVariant);
productRouter.delete("/:id/variant/:variantId", deleteVariant);

export { productRouter, productPublicRouter };
