import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
    const connectionString = process.env.NEON_CONNECTION_STRING;
    
    if (!connectionString) {
        return res.status(500).json({ error: "Database connection string not configured" });
    }
    
    const sql
