import { Client } from "minio";
import { ENV } from "#utils/config";

export const minioClient = new Client({
  endPoint: ENV.S3_ENDPOINT,
  useSSL: ENV.S3_USE_SSL,
  accessKey: ENV.S3_ACCESS_KEY,
  secretKey: ENV.S3_SECRET_KEY,
  port: ENV.S3_PORT,
  region: ENV.S3_REGION,
});

export const bucketName = ENV.S3_BUCKET;
