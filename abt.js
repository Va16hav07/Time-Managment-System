document.addEventListener("DOMContentLoaded", () => {
    console.log("About page loaded.");

    // Feature: Show an alert message when a user clicks on the "Help" button
    const helpButton = document.querySelector(".help-button");
    if (helpButton) {
        helpButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default navigation
            alert("Need help? Visit the Help page for guidance on using the Time Management System.");
            // Redirect to help page
            window.location.href = "help.html";
        });
    }

    // Smooth scroll to sections when links are clicked (if applicable)
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });

    // Placeholder for any future enhancements or interactive features
    console.log("Ready for more enhancements!");
});
