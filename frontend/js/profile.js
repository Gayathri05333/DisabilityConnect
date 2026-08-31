/* profile.js - view & update the logged-in user's profile */
document.addEventListener("DOMContentLoaded", async () => {
    const user = requireLogin();
    if (!user) return;

    const form = document.getElementById("profileForm");

    async function loadProfile() {
        try {
            const fresh = await apiFetch(`/users/${user.id}`);
            document.getElementById("name").value = fresh.name || "";
            document.getElementById("email").value = fresh.email || "";
            document.getElementById("phone").value = fresh.phone || "";
            document.getElementById("disabilityType").value = fresh.disabilityType || "Other";
            document.getElementById("accessibilityNeeds").value = fresh.accessibilityNeeds || "";
            setCurrentUser(fresh);
        } catch (err) {
            showAlert("alertBox", "Could not load your profile: " + err.message);
        }
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            disabilityType: document.getElementById("disabilityType").value,
            accessibilityNeeds: document.getElementById("accessibilityNeeds").value.trim()
        };
        try {
            const updated = await apiFetch(`/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            setCurrentUser(updated);
            showAlert("alertBox", "Profile updated successfully.", "success");
        } catch (err) {
            showAlert("alertBox", "Update failed: " + err.message);
        }
    });

    loadProfile();
});
