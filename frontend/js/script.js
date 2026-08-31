/* =====================================================
   DisabilityConnect - script.js
   Shared helpers: API base URL, auth/session helpers,
   navbar auth state, logout, and the global voice assistant.
   Loaded on every page BEFORE the page-specific JS file.
   ===================================================== */

// Change this if your Spring Boot backend runs on a different host/port.
const API_BASE = "http://localhost:8080/api";

/* ---------------- Session helpers (localStorage) ---------------- */
function getCurrentUser() {
    const raw = localStorage.getItem("dc_user");
    return raw ? JSON.parse(raw) : null;
}
function setCurrentUser(user) {
    localStorage.setItem("dc_user", JSON.stringify(user));
}
function clearCurrentUser() {
    localStorage.removeItem("dc_user");
}
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    return user;
}
function logout() {
    clearCurrentUser();
    window.location.href = "login.html";
}

/* ---------------- Navbar auth-aware rendering ---------------- */
function renderNavAuthArea() {
    const el = document.getElementById("navAuthArea");
    if (!el) return;
    const user = getCurrentUser();
    if (user) {
        el.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="dashboard.html"><i class="fa-solid fa-gauge"></i> Dashboard</a></li>
            <li class="nav-item"><span class="nav-link">Hi, ${escapeHtml(user.name)}</span></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="logout(); return false;"><i class="fa-solid fa-right-from-bracket"></i> Logout</a></li>
        `;
    } else {
        el.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="login.html"><i class="fa-solid fa-right-to-bracket"></i> Login</a></li>
            <li class="nav-item"><a class="nav-link" href="register.html"><i class="fa-solid fa-user-plus"></i> Register</a></li>
        `;
    }
}

/* ---------------- Small utilities ---------------- */
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, (m) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
}
function showAlert(containerId, message, type = "danger") {
    const box = document.getElementById(containerId);
    if (!box) { alert(message); return; }
    box.innerHTML = `<div class="alert alert-${type}" role="alert">${escapeHtml(message)}</div>`;
}
async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    let data = null;
    try { data = await res.json(); } catch (e) { /* no JSON body */ }
    if (!res.ok) {
        const msg = (data && data.message) ? data.message : `Request failed (${res.status})`;
        throw new Error(msg);
    }
    return data;
}

/* ---------------- Global Voice Assistant (Web Speech API) ---------------- */
function initVoiceAssistant(buttonId, outputId) {
    const btn = document.getElementById(buttonId);
    const output = document.getElementById(outputId);
    if (!btn) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        btn.disabled = true;
        btn.title = "Voice recognition is not supported in this browser";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    btn.addEventListener("click", () => {
        btn.classList.add("listening");
        if (output) output.textContent = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        if (output) output.textContent = `You said: "${transcript}"`;
        handleVoiceCommand(transcript);
    };

    recognition.onerror = () => {
        btn.classList.remove("listening");
        if (output) output.textContent = "Sorry, I didn't catch that. Please try again.";
    };

    recognition.onend = () => btn.classList.remove("listening");
}

function speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
}

function handleVoiceCommand(transcript) {
    let response = "Sorry, I didn't understand that command.";
    let target = null;

    if (transcript.includes("hospital")) {
        response = "Opening nearby hospitals.";
        target = "hospitals.html";
    } else if (transcript.includes("place") || transcript.includes("accessible")) {
        response = "Opening accessible places.";
        target = "places.html";
    } else if (transcript.includes("emergency") || transcript.includes("sos") || transcript.includes("help")) {
        response = "Opening emergency SOS.";
        target = "emergency.html";
    } else if (transcript.includes("profile")) {
        response = "Opening your profile.";
        target = "profile.html";
    } else if (transcript.includes("contact")) {
        response = "Opening emergency contacts.";
        target = "contacts.html";
    } else if (transcript.includes("dashboard") || transcript.includes("home")) {
        response = "Opening your dashboard.";
        target = "dashboard.html";
    }

    speak(response);
    if (target) {
        setTimeout(() => { window.location.href = target; }, 900);
    }
}

/* Render nav on every page load */
document.addEventListener("DOMContentLoaded", renderNavAuthArea);
