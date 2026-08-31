/* places.js - fetches and renders accessible places from the backend */
let allPlaces = [];

function renderPlaces(list) {
    const grid = document.getElementById("placesGrid");
    if (!list.length) {
        grid.innerHTML = `<p class="text-muted-dc">No accessible places found for this category yet.</p>`;
        return;
    }
    grid.innerHTML = list.map((p) => `
        <div class="col-md-6 col-lg-4">
            <div class="place-card">
                <img src="${escapeHtml(p.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600')}" alt="Photo of ${escapeHtml(p.name)}">
                <div class="body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="mb-0">${escapeHtml(p.name)}</h5>
                        <span class="badge-category">${escapeHtml(p.category || "Other")}</span>
                    </div>
                    <p class="text-muted-dc mb-1"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.address || "Address not available")}</p>
                    <p class="mb-2">${escapeHtml(p.description || "")}</p>
                    <span class="badge-access ${p.wheelchairAccess ? "" : "no"}">
                        <i class="fa-solid fa-wheelchair"></i> ${p.wheelchairAccess ? "Wheelchair Accessible" : "Limited Accessibility"}
                    </span>
                    ${p.phone ? `<p class="mt-2 mb-0"><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</p>` : ""}
                </div>
            </div>
        </div>
    `).join("");
}

async function loadPlaces() {
    try {
        allPlaces = await apiFetch("/places");
        renderPlaces(allPlaces);
    } catch (err) {
        showAlert("alertBox", "Could not load accessible places: " + err.message);
        document.getElementById("placesGrid").innerHTML = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlaces();
    document.getElementById("categoryFilter").addEventListener("change", (e) => {
        const val = e.target.value;
        renderPlaces(val ? allPlaces.filter((p) => p.category === val) : allPlaces);
    });
});
