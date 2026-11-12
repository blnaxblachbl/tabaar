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
import { getArchivedProducts } from "./archive/get";
import { restoreProductById } from "./archive/id/post";

import { ENV } from "#utils/config";
import { authMiddleware } from "#middlewares/routes/auth";

const productRouter = express.Router();

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

productRouter.get("/", getProducts); // public api
productRouter.post("/", authMiddleware, createProduct);
productRouter.get("/scroll", getProductsByScrollId); // public api
productRouter.post("/bulk", authMiddleware, upload.single("file"), bulkCreate);
productRouter.get("/archive", authMiddleware, getArchivedProducts);
productRouter.post("/archive/:id", authMiddleware, restoreProductById);
productRouter.get("/:id", getProductById); // public api
productRouter.put("/:id", authMiddleware, updateProductById);
productRouter.delete("/:id", authMiddleware, deleteProductById);
productRouter.post("/:id/variant", authMiddleware, appendVariant);
productRouter.put("/:id/variant/:variantId", authMiddleware, updateVariant);
productRouter.delete("/:id/variant/:variantId", authMiddleware, deleteVariant);

export { productRouter };
