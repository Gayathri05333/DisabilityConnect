/* emergency.js
   Workflow: SOS clicked -> get current location (Geolocation API) ->
   display location -> show saved emergency contacts -> share location.
   No external SMS infrastructure is used, per the mini-project scope. */

let lastLocation = null;

async function loadContactsList(userId) {
    const box = document.getElementById("contactsList");
    try {
        const contacts = await apiFetch(`/contacts/${userId}`);
        if (!contacts.length) {
            box.innerHTML = `<p class="text-muted-dc">You haven't added any emergency contacts yet. <a href="contacts.html">Add one now</a>.</p>`;
            return;
        }
        box.innerHTML = contacts.map((c) => `
            <div class="contact-chip">
                <div>
                    <strong>${escapeHtml(c.contactName)}</strong>
                    <div class="small text-muted-dc">${escapeHtml(c.relationship || "")}</div>
                </div>
                <a href="tel:${escapeHtml(c.phone)}" class="btn btn-sm btn-primary-dc"><i class="fa-solid fa-phone"></i> ${escapeHtml(c.phone)}</a>
            </div>
        `).join("");
    } catch (err) {
        box.innerHTML = `<p class="text-danger">Could not load emergency contacts: ${escapeHtml(err.message)}</p>`;
    }
}

function handleSos(user) {
    const alertBox = document.getElementById("alertBox");
    const locationBox = document.getElementById("locationBox");
    const locationText = document.getElementById("locationText");
    const shareBtn = document.getElementById("shareLocationBtn");

    if (!navigator.geolocation) {
        showAlert("alertBox", "Geolocation is not supported by your browser.");
        return;
    }

    showAlert("alertBox", "Requesting your location permission...", "info");

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            lastLocation = { latitude, longitude };

            showAlert("alertBox", "Location found. Showing your emergency contacts below.", "success");
            locationText.innerHTML = `Latitude: <strong>${latitude.toFixed(6)}</strong> &nbsp;|&nbsp; Longitude: <strong>${longitude.toFixed(6)}</strong>`;
            const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            shareBtn.href = mapsUrl;
            locationBox.style.display = "block";

            loadContactsList(user.id);
        },
        (error) => {
            showAlert("alertBox", "Could not get your location: " + error.message + ". Please allow location access and try again.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const user = requireLogin();
    if (!user) return;

    document.getElementById("sosBtn").addEventListener("click", () => handleSos(user));
});
