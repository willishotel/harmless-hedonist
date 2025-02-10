const carousel = document.querySelector(".carousel");
const prevButton = document.querySelector(".carousel-prev");
const nextButton = document.querySelector(".carousel-next");

let scrollAmount = 0;
const scrollStep = carousel.scrollWidth / carousel.children.length; // Moves one item width at a time

nextButton.addEventListener("click", () => {
    if (scrollAmount < carousel.scrollWidth - carousel.clientWidth) {
        scrollAmount += scrollStep;
    } else {
        scrollAmount = 0; // Loops back to start
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
});

prevButton.addEventListener("click", () => {
    if (scrollAmount > 0) {
        scrollAmount -= scrollStep;
    } else {
        scrollAmount = carousel.scrollWidth - carousel.clientWidth; // Loops to end
    }
    carousel.style.transform = `translateX(-${scrollAmount}px)`;
});
