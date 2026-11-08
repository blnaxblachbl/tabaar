import express from "express";

import { uploadImages } from "./post";
import { deleteImages } from "./delete";

const uploadRouter = express.Router();

uploadRouter.post("/", uploadImages);
uploadRouter.delete("/", deleteImages);

export { uploadRouter };
