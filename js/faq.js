document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", function () {
            const answer = this.nextElementSibling;
            const isOpen = answer.style.display === "block";

            // Close all answers before opening the clicked one
            document.querySelectorAll(".faq-answer").forEach(ans => ans.style.display = "none");

            // Toggle answer visibility
            answer.style.display = isOpen ? "none" : "block";
        });
    });
});
