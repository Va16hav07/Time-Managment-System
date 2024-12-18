document.addEventListener("DOMContentLoaded", () => {
    // Safely retrieve the logged-in user
    const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || null;

    // Redirect to landing page if user is already logged in
    if (loggedinUser) {
        window.location.href = "landing.html";
    }

    // Initialize local storage if it doesn't exist
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }
    if (!localStorage.getItem("loggedinUser")) {
        localStorage.setItem("loggedinUser", JSON.stringify(null));
    }

    // DOM elements
    const message = document.getElementById("message");
    const nameInput = document.getElementById("Name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const registerButton = document.getElementById("registerButton");
    const redirectToLoginButton = document.getElementById("redirectToLogin");

    const loginMessage = document.getElementById("loginMessage");
    const loginEmailInput = document.getElementById("loginemail");
    const loginPasswordInput = document.getElementById("loginPassword");
    const loginButton = document.getElementById("loginButton");
    const redirectToRegisterButton = document.getElementById("redirectToRegister");

    const registerPage = document.getElementById("registerPage");
    const loginPage = document.getElementById("loginPage");

    // Helper function to switch pages
    function togglePages(showRegister) {
        if (showRegister) {
            registerPage.classList.add("active");
            loginPage.classList.remove("active");
        } else {
            loginPage.classList.add("active");
            registerPage.classList.remove("active");
        }
    }

    // Handle registration
    registerButton?.addEventListener("click", () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!name || !email || !password) {
            message.textContent = "Please fill in all fields!";
            message.style.color = "red";
            return;
        }

        const users = JSON.parse(localStorage.getItem("users"));
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            message.textContent = "Email already registered. Try a different one.";
            message.style.color = "red";
        } else {
            users.push({ name, email, password });
            localStorage.setItem("users", JSON.stringify(users));
            message.textContent = "Account created successfully! You can now log in.";
            message.style.color = "green";

            // Clear input fields
            nameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
        }
    });

    // Redirect to login page
    redirectToLoginButton?.addEventListener("click", (e) => {
        e.preventDefault();
        togglePages(false);
    });

    // Handle login
    loginButton?.addEventListener("click", () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Store logged-in user, including their name and email
            localStorage.setItem(
                "loggedinUser",
                JSON.stringify({ name: user.name, email: user.email })
            );

            loginMessage.textContent = `Welcome, ${user.name}! Redirecting...`;
            loginMessage.style.color = "green";

            setTimeout(() => {
                window.location.href = "landing.html";
            }, 1000);
        } else {
            loginMessage.textContent = "Invalid credentials. Please try again.";
            loginMessage.style.color = "red";
        }
    });

    // Redirect to register page
    redirectToRegisterButton?.addEventListener("click", (e) => {
        e.preventDefault();
        togglePages(true);
    });
});
