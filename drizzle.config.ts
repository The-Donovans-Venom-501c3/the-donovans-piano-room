import { Config } from 'drizzle-kit'

import * as dotenv from 'dotenv'

dotenv.config({
  path: ".env",
})

export default {
  schema: "./database/schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    uri: process.env.DATABASE_URL as string,
  },
  out: "./drizzle"
} satisfies Config