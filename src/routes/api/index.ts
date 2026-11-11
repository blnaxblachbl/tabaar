import express from "express";
import merge from "deepmerge";

import { userRouteMiddleware } from "#middlewares/routes/user";
import { uploadRouteMiddleware } from "#middlewares/routes/uploads";
import { authMiddleware } from "#middlewares/routes/auth";

import { userRouter } from "#routes/api/user";
import { apiKeyRouter } from "#routes/api/api-key";
import { productRouter, productPublicRouter } from "#routes/api/product";
import { uploadRouter } from "#routes/api/upload";
import { imageRouter } from "#routes/api/image";

import userSwagger from "#routes/api/user/swagger.json";
import apiKeySwagger from "#routes/api/api-key/swagger.json";
import productSwagger from "#routes/api/product/swagger.json";
import uploadSwagger from "#routes/api/upload/swagger.json";
import imageSwagger from "#routes/api/image/swagger.json";
import mainSwagger from "#routes/api/swagger.json";

const apiRouter = express.Router();

apiRouter.use("/user", userRouteMiddleware, userRouter);
apiRouter.use("/api-key", authMiddleware, apiKeyRouter);
apiRouter.use("/product", productPublicRouter);
apiRouter.use("/product", authMiddleware, productRouter);
apiRouter.use("/upload", authMiddleware, uploadRouteMiddleware, uploadRouter);
apiRouter.use("/image", imageRouter);

apiRouter.get("/swagger", function (_req, res) {
  const result = merge.all([
    userSwagger,
    apiKeySwagger,
    productSwagger,
    uploadSwagger,
    imageSwagger,
  ]);
  res.json({
    ...result,
    ...mainSwagger,
  });
});

export { apiRouter };
