// --- 1. MAP CONFIGURATION (Leaflet.js) ---
// Initialize map centered on Philippines
const map = L.map('map').setView([12.8797, 121.7740], 5);

// Add OpenStreetMap tiles (Free)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Data for Focal Persons
const focalPoints = [
    {
        name: "Joseph Lapinid",
        role: "Mindanao",
        coords: [7.1907, 125.4553], // Approximate Mindanao center
        phone: "09307661916"
    },
    {
        name: "Raph Japuz Focal",
        role: "Visayas",
        coords: [11.0000, 123.0000], // Approximate Visayas center
        phone: "09649799427"
    },
    {
        name: "James Toregossa",
        role: "Luzon",
        coords: [15.0000, 120.5000], // Approximate Luzon center
        phone: "09231041877"
    }
];

// Add Markers to Map
focalPoints.forEach(person => {
    L.marker(person.coords)
        .addTo(map)
        .bindPopup(`<b>${person.name}</b><br>${person.role}<br>${person.phone}`);
});


// --- 2. NEON DB CONNECTION ---
// Import the Neon Serverless Client
import { NeonHttpNetworkClient } from "@neondatabase/serverless";

// YOUR CONNECTION STRING
const connectionString = "postgresql://neondb_owner:npg_HI4hYKsp8rWS@ep-silent-dawn-a1yauosz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Initialize the client
const sql = NeonHttpNetworkClient(connectionString);

// Function to fetch stats from the database
async function fetchDatabaseStats() {
    const logConsole = document.getElementById('console-log');
    
    try {
        // NOTE: You need to create a table named 'emergency_stats' in your Neon Dashboard first!
        // See instructions below for the SQL to create it.
        const result = await sql`SELECT * FROM emergency_stats LIMIT 1`;
        
        // Update UI with data
        // If the table is empty, we show default values
        if (result.length > 0) {
            document.getElementById('stat-incidents').innerText = result[0]?.incidents || "0";
            document.getElementById('stat-time').innerText = result[0]?.avg_time || "N/A";
            document.getElementById('stat-resources').innerText = result[0]?.resources || "0";
        } else {
            document.getElementById('stat-incidents').innerText = "0";
            document.getElementById('stat-time').innerText = "0m 0s";
            document.getElementById('stat-resources').innerText = "0";
        }
        
        // Add log entry
        addLog(`Database connected successfully. Fetched ${result.length} rows.`);

    } catch (error) {
        console.error("Database Error:", error);
        // Fallback for demo purposes if DB isn't connected yet
        document.getElementById('stat-incidents').innerText = "0";
        document.getElementById('stat-time').innerText = "0m 0s";
        document.getElementById('stat-resources').innerText = "0";
        addLog("Warning: Database connection string not set or table missing.");
    }
}

// Helper to add logs to the console box
function addLog(message) {
    const consoleDiv = document.getElementById('console-log');
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${time}] ${message}`;
    consoleDiv.appendChild(logEntry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight; // Auto scroll to bottom
}

// Run the fetch function when the page loads
window.addEventListener('load', fetchDatabaseStats);
