/* hospitals.js - fetches and renders hospitals with a "Get Directions" link */
async function loadHospitals() {
    try {
        const hospitals = await apiFetch("/hospitals");
        const grid = document.getElementById("hospitalsGrid");
        if (!hospitals.length) {
            grid.innerHTML = `<p class="text-muted-dc">No hospitals available yet.</p>`;
            return;
        }
        grid.innerHTML = hospitals.map((h) => {
            const mapsUrl = (h.latitude && h.longitude)
                ? `https://www.google.com/maps/dir/?api=1&destination=${h.latitude},${h.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + " " + (h.address || ""))}`;
            return `
            <div class="col-md-6 col-lg-4">
                <div class="hospital-card">
                    <img src="${escapeHtml(h.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600')}" alt="Photo of ${escapeHtml(h.name)}">
                    <div class="body">
                        <h5 class="mb-2">${escapeHtml(h.name)}</h5>
                        <p class="text-muted-dc mb-1"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(h.address || "Address not available")}</p>
                        <p class="mb-2"><i class="fa-solid fa-phone"></i> ${escapeHtml(h.phone || "N/A")}</p>
                        <span class="badge-access ${h.emergencyAvailable ? "" : "no"}">
                            <i class="fa-solid fa-truck-medical"></i> ${h.emergencyAvailable ? "24/7 Emergency Available" : "No Emergency Ward"}
                        </span>
                        <div class="mt-3">
                            <a href="${mapsUrl}" target="_blank" rel="noopener" class="btn btn-primary-dc w-100">
                                <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
        }).join("");
    } catch (err) {
        showAlert("alertBox", "Could not load hospitals: " + err.message);
        document.getElementById("hospitalsGrid").innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", loadHospitals);
