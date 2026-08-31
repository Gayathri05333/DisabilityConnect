/* admin.js - admin login, user list, and accessible places CRUD */

function getAdmin() {
    const raw = localStorage.getItem("dc_admin");
    return raw ? JSON.parse(raw) : null;
}
function setAdmin(admin) { localStorage.setItem("dc_admin", JSON.stringify(admin)); }
function adminLogout() { localStorage.removeItem("dc_admin"); window.location.href = "admin.html"; }

function showAdminDashboard() {
    document.getElementById("adminLoginSection").style.display = "none";
    document.getElementById("adminDashboardSection").style.display = "block";
    document.getElementById("adminLogoutNav").style.display = "block";
    loadUsers();
    loadPlacesAdmin();
}

function showTab(tab) {
    document.getElementById("usersTab").style.display = tab === "users" ? "block" : "none";
    document.getElementById("placesTab").style.display = tab === "places" ? "block" : "none";
    document.getElementById("tabUsersBtn").classList.toggle("active", tab === "users");
    document.getElementById("tabPlacesBtn").classList.toggle("active", tab === "places");
}

async function loadUsers() {
    const tbody = document.getElementById("usersTableBody");
    try {
        const users = await apiFetch("/admin/users");
        if (!users.length) {
            tbody.innerHTML = `<tr><td colspan="5">No users found.</td></tr>`;
            return;
        }
        tbody.innerHTML = users.map((u) => `
            <tr>
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.email)}</td>
                <td>${escapeHtml(u.phone || "")}</td>
                <td>${escapeHtml(u.disabilityType || "")}</td>
                <td><span class="badge ${u.role === "ADMIN" ? "bg-dark" : "bg-secondary"}">${escapeHtml(u.role)}</span></td>
            </tr>
        `).join("");
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-danger">Failed to load users: ${escapeHtml(err.message)}</td></tr>`;
    }
}

async function loadPlacesAdmin() {
    const box = document.getElementById("placesAdminList");
    try {
        const places = await apiFetch("/places");
        if (!places.length) {
            box.innerHTML = `<p class="text-muted-dc">No places added yet.</p>`;
            return;
        }
        box.innerHTML = places.map((p) => `
            <div class="contact-chip align-items-start">
                <div>
                    <strong>${escapeHtml(p.name)}</strong> <span class="badge-category">${escapeHtml(p.category || "")}</span>
                    <div class="small text-muted-dc">${escapeHtml(p.address || "")}</div>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick='editPlace(${JSON.stringify(p)})'><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePlace(${p.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join("");
    } catch (err) {
        box.innerHTML = `<p class="text-danger">Failed to load places: ${escapeHtml(err.message)}</p>`;
    }
}

function editPlace(p) {
    document.getElementById("placeId").value = p.id;
    document.getElementById("pName").value = p.name || "";
    document.getElementById("pCategory").value = p.category || "Hospital";
    document.getElementById("pAddress").value = p.address || "";
    document.getElementById("pDescription").value = p.description || "";
    document.getElementById("pImage").value = p.image || "";
    document.getElementById("pPhone").value = p.phone || "";
    document.getElementById("pWheelchair").checked = !!p.wheelchairAccess;
    document.getElementById("placeFormTitle").textContent = "Edit Accessible Place";
    document.getElementById("placeSubmitBtn").textContent = "Update Place";
    document.getElementById("cancelEditBtn").style.display = "block";
    showTab("places");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetPlaceForm() {
    document.getElementById("placeForm").reset();
    document.getElementById("placeId").value = "";
    document.getElementById("placeFormTitle").textContent = "Add Accessible Place";
    document.getElementById("placeSubmitBtn").textContent = "Add Place";
    document.getElementById("cancelEditBtn").style.display = "none";
}

async function deletePlace(id) {
    if (!confirm("Delete this accessible place?")) return;
    try {
        await apiFetch(`/places/${id}`, { method: "DELETE" });
        loadPlacesAdmin();
    } catch (err) {
        showAlert("dashAlertBox", "Could not delete place: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const admin = getAdmin();
    if (admin) showAdminDashboard();

    document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        try {
            const result = await apiFetch("/admin/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            setAdmin(result.data);
            showAdminDashboard();
        } catch (err) {
            showAlert("alertBox", err.message || "Admin login failed.");
        }
    });

    document.getElementById("placeForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("placeId").value;
        const payload = {
            name: document.getElementById("pName").value.trim(),
            category: document.getElementById("pCategory").value,
            address: document.getElementById("pAddress").value.trim(),
            description: document.getElementById("pDescription").value.trim(),
            image: document.getElementById("pImage").value.trim(),
            phone: document.getElementById("pPhone").value.trim(),
            wheelchairAccess: document.getElementById("pWheelchair").checked
        };
        try {
            if (id) {
                await apiFetch(`/places/${id}`, { method: "PUT", body: JSON.stringify(payload) });
                showAlert("dashAlertBox", "Place updated successfully.", "success");
            } else {
                await apiFetch("/places", { method: "POST", body: JSON.stringify(payload) });
                showAlert("dashAlertBox", "Place added successfully.", "success");
            }
            resetPlaceForm();
            loadPlacesAdmin();
        } catch (err) {
            showAlert("dashAlertBox", "Could not save place: " + err.message);
        }
    });
});
