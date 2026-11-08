import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "#utils/prisma/generated";
import { ENV } from "#utils/config";

const connectionString = ENV.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
