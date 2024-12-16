document.addEventListener("DOMContentLoaded", () => {
    // FAQ Toggle (show/hide answers)
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".question");
        const answer = item.querySelector(".answer");

        question.addEventListener("click", () => {
            // Toggle visibility of the answer
            answer.style.display = answer.style.display === "none" ? "block" : "none";
        });
    });
});
