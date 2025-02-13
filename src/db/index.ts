import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// For connection pooling in production
const client = postgres(connectionString);
export const db = drizzle(client);