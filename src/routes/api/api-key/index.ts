import express from "express";

import { getApiKeys } from "./get";
import { createApiKey } from "./post";
import { updateApiKey } from "./id/put";
import { getApiKeyById } from "./id/get";
import { deleteApiKeyById } from "./id/delete";

const apiKeyRouter = express.Router();

apiKeyRouter.get("/", getApiKeys);
apiKeyRouter.post("/", createApiKey);
apiKeyRouter.get("/:id", getApiKeyById);
apiKeyRouter.put("/:id", updateApiKey);
apiKeyRouter.delete("/:id", deleteApiKeyById);

export { apiKeyRouter };
