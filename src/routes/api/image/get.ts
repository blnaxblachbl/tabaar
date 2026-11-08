import type { Request, Response } from "express";
import z from "zod";

import { minioClient, bucketName } from "#utils/minio";
import { variantIdInParams } from "#utils/zod-schemas/id-params";

const scheme = z.intersection(
  variantIdInParams,
  z.object({
    name: z.string("Name is required"),
  }),
);

export const getImage = async (req: Request, res: Response) => {
  const { success, error, data: params } = scheme.safeParse(req.params);
  if (!success) {
    return res
      .status(400)
      .json({ message: error?.issues[0]?.message ?? "Invalid search pararms" });
  }
  const { variantId, id, name } = params;
  const url = await minioClient.presignedUrl(
    "GET",
    bucketName,
    `${id}/${variantId}/${name}`,
    24 * 60 * 60,
  );
  res.redirect(url);
};
