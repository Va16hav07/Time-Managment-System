document.addEventListener("DOMContentLoaded", () => {
    // Safely retrieve the logged-in user
    const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser")) || null;

    if (loggedinUser) {
        window.location.href = "landing.html";
    }
});

// Initialize local storage if it doesn't exist
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}

if (!localStorage.getItem("loggedinUser")) {
    localStorage.setItem("loggedinUser", JSON.stringify(null));
}

// DOM elements
const message = document.getElementById("message");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerButton = document.getElementById("registerButton");
const redirectToLoginButton = document.getElementById("redirectToLogin");

const loginMessage = document.getElementById("loginMessage");
const loginUsernameInput = document.getElementById("loginUsername");
const loginEmailInput = document.getElementById("loginemail");
const loginPasswordInput = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const redirectToRegisterButton = document.getElementById("redirectToRegister");

const registerPage = document.getElementById("registerPage");
const loginPage = document.getElementById("loginPage");

// Safely attach event listeners
if (registerButton) {
    // Handle registration
    registerButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !email || !password) {
            message.textContent = "Please fill in all fields!";
            message.style.color = "red";
            return;
        }

        const users = JSON.parse(localStorage.getItem("users"));
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            message.textContent = "Username already exists. Try a different one.";
            message.style.color = "red";
        } else {
            users.push({ username, email, password });
            localStorage.setItem("users", JSON.stringify(users));
            message.textContent = "Account created successfully! You can now log in.";
            message.style.color = "green";

            usernameInput.value = "";
            emailInput.value = "";
            passwordInput.value = "";
        }
    });
}

if (redirectToLoginButton) {
    redirectToLoginButton.addEventListener("click", () => {
        registerPage.classList.remove("active");
        loginPage.classList.add("active");
    });
}

if (loginButton) {
    // Handle login
    loginButton.addEventListener("click", () => {
        const username = loginUsernameInput.value.trim();
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        const users = JSON.parse(localStorage.getItem("users"));
        const user = users.find(
            user => user.username === username && user.email === email && user.password === password
        );

        if (user) {
            // Store logged-in user as an object, not an array
            localStorage.setItem(
                "loggedinUser",
                JSON.stringify({ username: user.username, email: user.email })
            );

            loginMessage.textContent = "Login successful! Redirecting...";
            loginMessage.style.color = "green";

            setTimeout(() => {
                window.location.href = "landing.html";
            }, 1000);
        } else {
            loginMessage.textContent = "Invalid credentials. Please try again.";
            loginMessage.style.color = "red";
        }
    });
}

if (redirectToRegisterButton) {
    redirectToRegisterButton.addEventListener("click", () => {
        loginPage.classList.remove("active");
        registerPage.classList.add("active");
    });
}
