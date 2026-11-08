const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const { Client: ElasticClient } = require("@elastic/elasticsearch");
const { Client: MinioClient } = require("minio");

dotenvExpand.expand(dotenv.config());

const client = new Client({ connectionString: process.env.DATABASE_URL });
const minioClient = new MinioClient({
  endPoint: process.env.S3_ENDPOINT,
  useSSL: process.env.S3_ENDPOINT.includes("https"),
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
});

const elasticsearch = new ElasticClient({
  node: process.env.ELASTIC_URL,
  tls: {
    ca: process.env.ELASTIC_CA,
    rejectUnauthorized: false,
  },
});
const PRODUCT_PIPELINE_NAME = "tabaar_product_pipeline";
const PRODUCT_INDEX_NAME = "tabaar_products";

async function seedUsers() {
  //Patient Zero
  let users = await client.query(`
    select * from "User" u
  `);
  if (!users.rowCount) {
    const createdUser = await client.query(
      `
      INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *
    `,
      [
        "Admin",
        process.env.USER_EMAIL,
        bcrypt.hashSync(process.env.USER_PASSWORD),
      ],
    );
    users = createdUser;
  }
  return users.rows;
}

async function seedApiKey() {
  let apiKey = await client.query(`
    select * from "ApiKey"
  `);
  if (!apiKey.rowCount) {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    const createdApiKey = await client.query(
      `
      INSERT INTO "ApiKey" (name, "expiredAt") VALUES ($1, $2) RETURNING *
    `,
      ["Default", now],
    );
    apiKey = createdApiKey;
  }
  return apiKey.rows;
}

async function seedPipelines() {
  try {
    const pipeLines = await elasticsearch.ingest.getPipeline({
      id: PRODUCT_PIPELINE_NAME,
    });
    console.log("product pipeline response", pipeLines);
  } catch (error) {
    console.log("product pipeline error", error.meta.statusCode);
    if (error.meta?.statusCode === 404) {
      const pipeLine = await elasticsearch.ingest.putPipeline({
        id: PRODUCT_PIPELINE_NAME,
        body: {
          processors: [
            {
              set: {
                field: "createdAt",
                value: "{{_ingest.timestamp}}",
                override: false,
              },
            },
            {
              set: {
                field: "updatedAt",
                value: "{{_ingest.timestamp}}",
                override: true,
              },
            },
            {
              set: {
                field: "deleted",
                value: false,
                override: false,
              },
            },
            {
              set: {
                field: "variants",
                value: [],
                override: false,
              },
            },
          ],
        },
      });
      console.log("Created default_pipeline", pipeLine);
    }
  }
}

async function seedIndices() {
  const existProducts = await elasticsearch.indices.exists({
    index: PRODUCT_INDEX_NAME,
  });
  console.log("existProducts", existProducts);
  if (!existProducts) {
    const createdRangeIndex = await elasticsearch.indices.create({
      index: PRODUCT_INDEX_NAME,
      body: {
        mappings: {
          runtime: {
            available: {
              type: "boolean",
              script: {
                source: `
                  def res = false;
                  if (params._source.variants != null && !params._source.variants.isEmpty()) {
                    res = params._source.variants.stream().allMatch(item -> item.get('count') > 0);
                  }
                  emit(res);
                `,
              },
            },
            min_price: {
              type: "double",
              script: {
                source: `
                  double min = 0;
                  if (params._source.variants != null && !params._source.variants.isEmpty()) {
                    def first = params._source.variants[0];
                    if (first != null && first.price != null) {
                      min = ((Number) first.price).doubleValue();
                      for (def v : params._source.variants) {
                        if (v != null && v.price != null) {
                          double p = ((Number) v.price).doubleValue();
                          if (p < min) {
                            min = p;
                          }
                        }
                      }
                    }
                  }
                  emit(min);
                `,
              },
            },
            max_price: {
              type: "double",
              script: {
                source: `
                  double max = 0;
                  if (params._source.variants != null && !params._source.variants.isEmpty()) {
                    def first = params._source.variants[0];
                    if (first != null && first.price != null) {
                      max = ((Number) first.price).doubleValue();
                      for (def v : params._source.variants) {
                        if (v != null && v.price != null) {
                          double p = ((Number) v.price).doubleValue();
                          if (p > max) {
                            max = p;
                          }
                        }
                      }
                    }
                  }
                  emit(max);
                `,
              },
            },
          },
          properties: {
            //default
            id: { type: "keyword" },
            createdAt: { type: "date" },
            updatedAt: { type: "date" },
            deleted: { type: "boolean" },
            //fields
            name: {
              properties: {
                locale: { type: "keyword" },
                content: { type: "text" },
              },
            },
            description: {
              properties: {
                locale: { type: "keyword" },
                content: { type: "text" },
              },
            },
            characterstics: {
              dynamic: true,
              properties: {},
            },
            variants: {
              type: "nested",
              properties: {
                //default
                id: { type: "keyword" },
                createdAt: { type: "date" },
                updatedAt: { type: "date" },
                //fields
                characterstics: {
                  dynamic: true,
                  properties: {},
                },
                price: { type: "float" },
                count: { type: "integer" },
                currency: { type: "keyword" },
                images: { type: "text" },
              },
            },
          },
        },
      },
      settings: {
        default_pipeline: PRODUCT_PIPELINE_NAME,
      },
    });
    console.log("Created index", createdRangeIndex);
  }
}

async function seedBucket() {
  const bucketExists = await minioClient.bucketExists(process.env.S3_BUCKET);
  if (!bucketExists) {
    await minioClient.makeBucket(process.env.S3_BUCKET);
    console.log("Bucket created:", process.env.S3_BUCKET);
  } else {
    console.log("Bucket exist:", process.env.S3_BUCKET);
  }
}

async function seed() {
  await client.connect();
  await seedBucket();
  try {
    const users = await seedUsers();
    console.log("created user - ", "\x1b[32m", users[0].email, "\x1b[0m");
  } catch (error) {
    console.error(error);
  }
  try {
    const apiKey = await seedApiKey();
    console.log("created api key - ", "\x1b[32m", apiKey[0].key, "\x1b[0m");
  } catch (error) {
    console.error(error);
  }
  await client.end();
  await seedPipelines();
  await seedIndices();
  process.exit(0);
}

seed();
