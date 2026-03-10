import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
    const connectionString = process.env.NEON_CONNECTION_STRING;
    
    if (!connectionString) {
        return res.status(500).json({ error: "Database connection string not configured" });
    }
    
    const sql = neon(connectionString);
    
    try {
        const result = await sql`SELECT * FROM emergency_stats LIMIT 1`;
        res.status(200).json(result);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: error.message });
    }
}
