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
        
        // Count severity codes
        let redCount = 0;
        let orangeCount = 0;
        let yellowCount = 0;
        
        // Clear existing rows
        document.getElementById('incident-rows').innerHTML = '';
        
        // Process each incident
        result.forEach(incident => {
            // Count by severity
            if (incident.severity_code === 'Red') redCount++;
            else if (incident.severity_code === 'Orange') orangeCount++;
            else if (incident.severity_code === 'Yellow') yellowCount++;
            
            // Add row to table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${incident.incident_date || 'N/A'}</td>
                <td>${incident.incident_time || 'N/A'}</td>
                <td><span class="severity-${incident.severity_code?.toLowerCase()}">${incident.severity_code || 'N/A'}</span></td>
                <td>${incident.section || 'N/A'}</td>
                <td>${incident.building || 'N/A'}</td>
                <td>${incident.floor || 'N/A'}</td>
            `;
            document.getElementById('incident-rows').appendChild(row);
        });
        
        // Update stats
        document.getElementById('stat-red').innerText = redCount;
        document.getElementById('stat-orange').innerText = orangeCount;
        document.getElementById('stat-yellow').innerText = yellowCount;
        
        addLog(`Database connected successfully. Fetched ${result.length} rows.`);

    } catch (error) {
        console.error("Database Error:", error);
        addLog(`ERROR: ${error.message}`);
        document.getElementById('stat-red').innerText = "0";
        document.getElementById('stat-orange').innerText = "0";
        document.getElementById('stat-yellow').innerText = "0";
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
