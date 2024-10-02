// File: scrollbar.js

// Function to handle the visibility of the scrollbar
function handleScroll() {
    const container = document.querySelector('.profile-container');

    if (container) {
        // Add or remove a class based on scroll position
        if (container.scrollTop > 0) {
            container.classList.add('show-scrollbar');
        } else {
            container.classList.remove('show-scrollbar');
        }
    }
}

// Add event listener to handle scroll event
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.profile-container');
    if (container) {
        container.addEventListener('scroll', handleScroll);
    }
});
