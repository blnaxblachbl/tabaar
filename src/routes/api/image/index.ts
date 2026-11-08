import express from "express";
import { getImage } from "./get";

const imageRouter = express.Router();

imageRouter.get("/:id/:variantId/:name", getImage);

export { imageRouter };
