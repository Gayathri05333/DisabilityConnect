/* login.js - handles the login form on login.html */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const result = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });
            setCurrentUser(result.data);
            window.location.href = "dashboard.html";
        } catch (err) {
            showAlert("alertBox", err.message || "Login failed. Please check your credentials.");
        }
    });
});
