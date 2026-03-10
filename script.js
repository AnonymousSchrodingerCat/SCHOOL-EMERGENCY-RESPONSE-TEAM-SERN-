// --- 1. MAP CONFIGURATION (Leaflet.js) ---
const map = L.map('map').setView([12.8797, 121.7740], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const focalPoints = [
    {
        name: "Joseph Lapinid",
        role: "Mindanao",
        coords: [7.1907, 125.4553],
        phone: "09307661916"
    },
    {
        name: "Raph Japuz Focal",
        role: "Visayas",
        coords: [11.0000, 123.0000],
        phone: "09649799427"
    },
    {
        name: "James Toregossa",
        role: "Luzon",
        coords: [15.0000, 120.5000],
        phone: "09231041877"
    }
];

focalPoints.forEach(person => {
    L.marker(person.coords)
        .addTo(map)
        .bindPopup(`<b>${person.name}</b><br>${person.role}<br>${person.phone}`);
});


// --- 2. NEON DB CONNECTION (Via API) ---
async function fetchDatabaseStats() {
    const logConsole = document.getElementById('console-log');
    
    try {
        addLog("Connecting to database via API...");
        
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.length > 0) {
            document.getElementById('stat-incidents').innerText = result[0]?.incidents || "0";
            document.getElementById('stat-time').innerText = result[0]?.avg_time || "N/A";
            document.getElementById('stat-resources').innerText = result[0]?.resources || "0";
            addLog(`Database connected successfully. Fetched ${result.length} rows.`);
        } else {
            document.getElementById('stat-incidents').innerText = "0";
            document.getElementById('stat-time').innerText = "0m 0s";
            document.getElementById('stat-resources').innerText = "0";
            addLog("Warning: Table exists but no data found.");
        }

    } catch (error) {
        console.error("Database Error:", error);
        addLog(`ERROR: ${error.message}`);
        document.getElementById('stat-incidents').innerText = "0";
        document.getElementById('stat-time').innerText = "0m 0s";
        document.getElementById('stat-resources').innerText = "0";
    }
}

function addLog(message) {
    const consoleDiv = document.getElementById('console-log');
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${time}] ${message}`;
    consoleDiv.appendChild(logEntry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

window.addEventListener('load', fetchDatabaseStats);
