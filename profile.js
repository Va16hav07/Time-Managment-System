const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const editProfileButton = document.getElementById("editProfileButton");
const loggedinUser = JSON.parse(localStorage.getItem("loggedinUser"));

if (!loggedinUser) {
    window.location.href = "index.html";
} else {
    profileUsername.textContent = `Name: ${loggedinUser.name}`;
    profileEmail.textContent = `Email: ${loggedinUser.email}`;
}

editProfileButton.addEventListener("click", () => {
    const newUsername = prompt("Enter your new Name:", loggedinUser.name);
    const newEmail = prompt("Enter your new email:", loggedinUser.email);

    if (newUsername && newEmail && newPassword) {
        loggedinUser.name = newName;
        loggedinUser.email = newEmail;
        localStorage.setItem("loggedinUser", JSON.stringify(loggedinUser));

        alert("Profile updated successfully!");
        window.location.href = "landing.html"; 
    } else {
        alert("Please fill in all fields.");
    }
});
