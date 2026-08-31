/* contacts.js - add / view / delete emergency contacts for the logged-in user */
let currentUser = null;

async function loadContacts() {
    const box = document.getElementById("contactsList");
    try {
        const contacts = await apiFetch(`/contacts/${currentUser.id}`);
        if (!contacts.length) {
            box.innerHTML = `<p class="text-muted-dc">No emergency contacts added yet.</p>`;
            return;
        }
        box.innerHTML = contacts.map((c) => `
            <div class="contact-chip">
                <div>
                    <strong>${escapeHtml(c.contactName)}</strong>
                    <div class="small text-muted-dc">${escapeHtml(c.relationship || "")} &middot; ${escapeHtml(c.phone)}</div>
                </div>
                <button class="btn btn-sm btn-outline-danger" data-id="${c.id}" onclick="deleteContact(${c.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `).join("");
    } catch (err) {
        box.innerHTML = `<p class="text-danger">Could not load contacts: ${escapeHtml(err.message)}</p>`;
    }
}

async function deleteContact(id) {
    if (!confirm("Delete this emergency contact?")) return;
    try {
        await apiFetch(`/contacts/${id}`, { method: "DELETE" });
        loadContacts();
    } catch (err) {
        showAlert("alertBox", "Could not delete contact: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    currentUser = requireLogin();
    if (!currentUser) return;

    loadContacts();

    document.getElementById("contactForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            contactName: document.getElementById("contactName").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            relationship: document.getElementById("relationship").value.trim()
        };
        try {
            await apiFetch(`/contacts?userId=${currentUser.id}`, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            document.getElementById("contactForm").reset();
            showAlert("alertBox", "Contact added successfully.", "success");
            loadContacts();
        } catch (err) {
            showAlert("alertBox", "Could not add contact: " + err.message);
        }
    });
});
