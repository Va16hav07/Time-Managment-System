const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const editProfileButton = document.getElementById("editProfileButton");
const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"));

if (!loggedinUser) {
    window.location.href = "index.html";
} else {
    profileUsername.textContent = `Username: ${loggedinUser.username}`;
    profileEmail.textContent = `Email: ${loggedinUser.email}`;
}

editProfileButton.addEventListener("click", () => {
    const newUsername = prompt("Enter your new username:", loggedinUser.username);
    const newEmail = prompt("Enter your new email:", loggedinUser.email);
    const newPassword = prompt("Enter your new password:");

    if (newUsername && newEmail && newPassword) {
        loggedinUser.username = newUsername;
        loggedinUser.email = newEmail;
        loggedinUser.password = newPassword;
        localStorage.setItem("loggedinUser", JSON.stringify(loggedinUser));

        alert("Profile updated successfully!");
        window.location.href = "landing.html"; 
    } else {
        alert("Please fill in all fields.");
    }
});
