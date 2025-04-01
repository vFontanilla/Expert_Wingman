document.addEventListener('DOMContentLoaded', function () {
    const gridItems = document.querySelectorAll('.grid-item');

    gridItems.forEach(item => {
        const popup = item.querySelector('.popup-container');

        // Create close button
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '&times;'; // "×" symbol
        closeButton.classList.add('close-button');

        // Append the close button inside the popup
        popup.appendChild(closeButton);

        // Handle click to open pop-up on mobile
        item.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                event.stopPropagation(); // Prevent triggering the document click handler

                // Close all other pop-ups
                document.querySelectorAll('.popup-container').forEach(otherPopup => {
                    if (otherPopup !== popup) {
                        otherPopup.classList.remove('visible');
                    }
                });

                // Toggle visibility of the clicked pop-up
                if (popup.classList.contains('visible')) {
                    popup.classList.remove('visible');
                } else {
                    popup.classList.add('visible');
                }
            }
        });

        // Clicking the close button closes the pop-up
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent propagation to the item click handler
            popup.classList.remove('visible'); // Close the pop-up
        });
    });

    // Clicking anywhere outside closes all pop-ups
    document.addEventListener('click', function() {
        document.querySelectorAll('.popup-container').forEach(popup => {
            popup.classList.remove('visible');
        });
    });
});
