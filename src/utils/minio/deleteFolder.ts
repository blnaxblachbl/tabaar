//@ts-nocheck
import { ObjectInfo } from "minio/dist/main/internal/type";

import { bucketName, minioClient } from ".";
import { deleteFiles } from "./deleteFiles";

export function deleteFolder(path: string) {
  const stream = minioClient.listObjects(bucketName, path, true);
  let data: ObjectInfo[] = [];
  stream.on("data", function (obj) {
    if (obj.name) {
      data.push(obj);
    }
  });
  stream.on("end", function () {
    if (data.length) {
      deleteFiles(data.map((o) => o.name!));
    }
  });
  stream.on("error", function (err) {
    console.error("Delete images error", err);
  });
}
