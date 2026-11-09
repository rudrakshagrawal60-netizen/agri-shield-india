// Apni Google AI Studio API key yahan daalein
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

let telemetryChart;
let autoStreamActive = true;
let currentLanguage = 'en'; // Default English

window.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('telemetryChart').getContext('2d');
    telemetryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10:00', '10:15', '10:30', '10:45', '11:00'],
            datasets: [{
                label: 'Temperature (°C)',
                data: [4.1, 4.3, 4.0, 4.2, 4.2],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#64748b' } },
                y: { grid: { color: 'rgba(30, 41, 59, 0.5)' }, ticks: { color: '#64748b' } }
            }
        }
    });
});

function showToast(message) {
    const toast = document.getElementById("toastNotification");
    const toastText = document.getElementById("toastText");
    toastText.innerText = message;
    toast.classList.add("show-toast");
    setTimeout(() => {
        toast.classList.remove("show-toast");
    }, 4000);
}

function addLog(message) {
    const ticker = document.getElementById("logTicker");
    if (!ticker) return;
    const timeStr = new Date().toLocaleTimeString();
    const newDiv = document.createElement("div");
    newDiv.innerText = `[${timeStr}] ${message}`;
    ticker.prepend(newDiv);
}

// Toggle Language between English and Hindi for Indian Users
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const btn = document.getElementById("langToggleBtn");
    btn.innerText = currentLanguage === 'en' ? '🇮🇳 हिंदी / English' : '🇬🇧 English / हिंदी';
    addLog(`Language switched to ${currentLanguage.toUpperCase()}`);
}

function triggerActuator(type) {
    const crop = document.getElementById("cropSelector").value;
    if (type === 'compressor') {
        showToast("❄️ Compressor Boost activated. Cooling cycle enhanced.");
        addLog("Actuator: Emergency compressor override engaged.");
        callGeminiAI(`Actuator Action Executed: Compressor Boost engaged for Indian cold storage (${crop}). Explain how this protects against Indian summer heat spikes in 2 bullet points.`);
    } else if (type === 'scrubber') {
        showToast("💨 Ethylene Scrubber deployed. Gas levels flushing.");
        addLog("Actuator: Ethylene chemical scrubber active.");
        callGeminiAI(`Actuator Action Executed: Ethylene Scrubber deployed for ${crop}. Explain how removing ethylene prevents premature ripening in local mandis in 2 bullet points.`);
    } else if (type === 'reroute') {
        showToast("🚚 Transit truck rerouted via National Highway corridor.");
        addLog("Logistics: GPS route recalculated for Indian transport.");
        callGeminiAI(`Actuator Action Executed: Transit truck rerouted for ${crop}. Describe how dynamic rerouting minimizes highway transit delays in India.`);
    }
}

// Enhanced Compliance Audit Report Generator
function downloadAuditReport() {
    const crop = document.getElementById("cropSelector").value.toUpperCase();
    const zone = document.getElementById("zoneSelector").value.toUpperCase();
    const temp = document.getElementById("tempValue").innerText;
    const hum = document.getElementById("humValue").innerText;
    const eth = document.getElementById("ethValue").innerText;
    const saved = document.getElementById("savedValue").innerText;
    const aiText = document.getElementById("aiResponse").innerText;
    const timestamp = new Date().toLocaleString();

    let status = "OPTIMAL / SAFE";
    if (parseFloat(temp) > 10) status = "MODERATE SPOILAGE RISK";
    if (parseFloat(temp) > 20) status = "CRITICAL HAZARD SPIKE";

    const reportContent = `
=====================================================
    AGRI-SHIELD INDIA: COLD CHAIN AUDIT REPORT
=====================================================
Generated Timestamp : ${timestamp}
Cold Storage Hub    : ${zone} (India Node)
Target Commodity    : ${crop}
System Health Status: [ ${status} ]

-----------------------------------------------------
1. LIVE IOT TELEMETRY METRICS
-----------------------------------------------------
- Storage Temperature : ${temp} (Optimal: 2°C - 6°C)
- Relative Humidity   : ${hum} (Optimal: 80% - 90% )
- Ethylene Gas Level  : ${eth} (Safe Threshold: < 0.1 ppm)
- Estimated Financial Protection (ROI): ${saved}

-----------------------------------------------------
2. GEMINI AI RISK ANALYSIS & ADVISORY LOGS
-----------------------------------------------------
${aiText}

-----------------------------------------------------
3. REGULATORY COMPLIANCE & VERIFICATION
-----------------------------------------------------
Generated for Indian Agricultural Supply Chain Standards 
via IoT Edge Gateway & Google Gemini 1.5 API.
Certified for Post-Harvest Wastage Reduction in India.
=====================================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriShield_India_Audit_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("📥 Indian Compliance Audit Report downloaded!");
    addLog(`Audit Report generated for ${zone} (${crop}).`);
}

async function callGeminiAI(promptText) {
    const aiBox = document.getElementById("aiResponse");
    aiBox.innerHTML = `<span class="text-indigo-400 animate-pulse">Analyzing Indian cold-chain telemetry via Gemini AI (${currentLanguage.toUpperCase()})...</span>`;

    let finalPrompt = promptText;
    if (currentLanguage === 'hi') {
        finalPrompt += " Please provide the response in simple Hindi language.";
    }

    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE" || !GEMINI_API_KEY) {
        setTimeout(() => {
            aiBox.innerHTML = `<strong>[Demo AI Advisory]:</strong><br>${finalPrompt}`;
        }, 800);
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: finalPrompt }] }]
            })
        });

        const data = await response.json();
        const output = data.candidates[0].content.parts[0].text;
        aiBox.innerHTML = output.replace(/\n/g, '<br>');
        addLog("Gemini AI successfully processed Indian market telemetry.");
    } catch (error) {
        aiBox.innerHTML = `<span class="text-rose-400">Error connecting to Gemini API. Please check your API key.</span>`;
        console.error(error);
        addLog("Error: Failed to fetch Gemini API response.");
    }
}

function simulateCondition(type) {
    const tempEl = document.getElementById("tempValue");
    const humEl = document.getElementById("humValue");
    const ethEl = document.getElementById("ethValue");
    const savedEl = document.getElementById("savedValue");
    const mainBody = document.getElementById("mainBody");
    const crop = document.getElementById("cropSelector").value;

    let prompt = "";
    let newData = [];

    mainBody.classList.remove('critical-alert');

    if (type === 'optimal') {
        tempEl.innerText = "4.2°C";
        tempEl.className = "text-xl font-bold mt-1 text-emerald-400";
        humEl.innerText = "85%";
        ethEl.innerText = "0.05 ppm";
        savedEl.innerText = "₹1,45,000";
        newData = [4.1, 4.3, 4.0, 4.2, 4.2];
        telemetryChart.data.datasets[0].borderColor = '#10b981';
        
        addLog("Scenario: Normal Safe Conditions (Indian Cold Storage Node).");
        prompt = `Current IoT telemetry for ${crop} in an Indian cold storage warehouse shows normal conditions (Temp: 4.2°C, Humidity: 85%). Provide a brief status confirmation confirming stock safety.`;
    } 
    else if (type === 'warning') {
        tempEl.innerText = "14.5°C";
        tempEl.className = "text-xl font-bold mt-1 text-amber-400";
        humEl.innerText = "72%";
        ethEl.innerText = "0.22 ppm";
        savedEl.innerText = "₹78,000";
        newData = [6.0, 9.5, 12.0, 13.5, 14.5];
        telemetryChart.data.datasets[0].borderColor = '#f59e0b';

        showToast("⚠️ Warning: WhatsApp alert sent to Cold Storage Owner.");
        addLog("Scenario: Moderate Spoilage Risk due to ambient heat spike.");
        prompt = `Warning for ${crop}: Storage temperature spiked to 14.5°C due to ambient heat. Provide 3 immediate steps for an Indian cold storage supervisor to prevent crop rotting.`;
    } 
    else if (type === 'critical') {
        tempEl.innerText = "26.8°C";
        tempEl.className = "text-xl font-bold mt-1 text-rose-400";
        humEl.innerText = "58%";
        ethEl.innerText = "0.52 ppm";
        savedEl.innerText = "₹12,000 (At Risk)";
        newData = [9.0, 16.2, 21.5, 24.1, 26.8];
        telemetryChart.data.datasets[0].borderColor = '#f43f5e';
        
        mainBody.classList.add('critical-alert');
        showToast("🚨 CRITICAL: Emergency WhatsApp alert dispatched to Mandi Committee!");
        addLog("ALERT: Critical Hazard! High risk of total harvest loss in local facility.");

        prompt = `CRITICAL HAZARD for ${crop}: Temperature reached 26.8°C and ethylene spiked to 0.52 ppm. Rapid spoilage imminent in Indian market conditions. Suggest emergency salvage and local market diversion plan.`;
    }

    telemetryChart.data.datasets[0].data = newData;
    telemetryChart.update();
    callGeminiAI(prompt);
}

function sendCustomQuery() {
    const query = document.getElementById("customQuery").value;
    const crop = document.getElementById("cropSelector").value;
    if (!query) return;
    addLog(`User Custom Query sent to Gemini: "${query}"`);
    callGeminiAI(`Act as an Indian agricultural cold chain logistics expert powered by Gemini for ${crop}. Answer concisely: ${query}`);
    document.getElementById("customQuery").value = "";
}

function changeZone() {
    const zone = document.getElementById("zoneSelector").value;
    document.getElementById("aiResponse").innerHTML = `<strong>[System Update]:</strong> Switched to ${zone.toUpperCase()} (India Node). Telemetry synchronized.`;
    addLog(`Zone switched to ${zone.toUpperCase()}.`);
}

function changeCrop() {
    const crop = document.getElementById("cropSelector").value;
    document.getElementById("aiResponse").innerHTML = `<strong>[System Update]:</strong> Monitoring profile updated for Indian commodity: <strong>${crop.toUpperCase()}</strong>.`;
    addLog(`Target crop profile updated to ${crop.toUpperCase()}.`);
}