document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
  
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
  
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
  
      alert("Registration successful!");
      registerForm.reset();
    });
  
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      const storedEmail = localStorage.getItem("email");
      const storedPassword = localStorage.getItem("password");

      if (email === storedEmail && password === storedPassword) {
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password!");
      }
  
      loginForm.reset();
    });
  });
  