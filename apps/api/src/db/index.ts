import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let _db: Database | null = null;

export function getDb(): Database {
    if (_db) return _db;
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE URL is required");
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema });
    return _db;
}

export { schema };
