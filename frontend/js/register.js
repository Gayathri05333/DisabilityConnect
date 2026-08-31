/* register.js - handles the registration form on register.html */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
            phone: document.getElementById("phone").value.trim(),
            disabilityType: document.getElementById("disabilityType").value
        };

        if (!payload.name || !payload.email || !payload.password || !payload.phone || !payload.disabilityType) {
            showAlert("alertBox", "Please fill in all fields.");
            return;
        }
        if (payload.password.length < 6) {
            showAlert("alertBox", "Password must be at least 6 characters.");
            return;
        }

        try {
            const result = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setCurrentUser(result.data);
            showAlert("alertBox", "Registration successful! Redirecting to your dashboard...", "success");
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
        } catch (err) {
            showAlert("alertBox", err.message || "Registration failed. Please try again.");
        }
    });
});
