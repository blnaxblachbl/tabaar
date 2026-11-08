import { Client } from "@elastic/elasticsearch";

import { ENV } from "#utils/config";

export const elasticSearch = new Client({
  node: ENV.ELASTIC_URL,
  tls: {
    ca: ENV.ELASTIC_CA,
    rejectUnauthorized: false,
  },
});
