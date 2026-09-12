// Carousel Variables
let currentSlideIndex = 1;
const autoSlideInterval = 6000; // Change slide every 6 seconds

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    startAutoSlide();
});

// Manual slide navigation
function moveSlide(n) {
    clearInterval(autoSlideTimer);
    showSlide(currentSlideIndex += n);
    startAutoSlide();
}

// Go to specific slide
function currentSlide(n) {
    clearInterval(autoSlideTimer);
    showSlide(currentSlideIndex = n);
    startAutoSlide();
}

// Show specific slide
function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');

    if (n > slides.length) {
        currentSlideIndex = 1;
    }
    if (n < 1) {
        currentSlideIndex = slides.length;
    }

    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Remove active class from all indicators
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Show current slide and highlight indicator
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (indicators[currentSlideIndex - 1]) {
        indicators[currentSlideIndex - 1].classList.add('active');
    }
}

// Auto slide functionality
let autoSlideTimer;

function startAutoSlide() {
    autoSlideTimer = setInterval(function() {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, autoSlideInterval);
}

// Pause auto-slide on hover
document.addEventListener('mouseover', function(event) {
    if (event.target.closest('.carousel-container')) {
        clearInterval(autoSlideTimer);
    }
});

// Resume auto-slide on mouse leave
document.addEventListener('mouseout', function(event) {
    if (event.target.closest('.carousel-container')) {
        startAutoSlide();
    }
});
