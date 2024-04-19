// JavaScript code
document.addEventListener("DOMContentLoaded", function() {
    const popupButton = document.getElementById("popupButton");
    const popupForm = document.getElementById("popupForm");
    const closeForm = document.getElementById("closeForm");

    // Function to show the popup form
    function showForm() {
        popupForm.style.display = "block";
    }

    // Function to hide the popup form
    function closePopup() {
        popupForm.style.display = "none";
    }

    // Event listener for the popup button to show the form
    popupButton.addEventListener("click", showForm);

    // Event listener for the close button to hide the form
    closeForm.addEventListener("click", closePopup);

    // Close the form if the user clicks outside of it
    window.addEventListener("click", function(event) {
        if (event.target === popupForm) {
            closePopup();
        }
    });
});
// JavaScript code for loading dp,tagline and description
// Get the button and the popup form
const editBtn = document.getElementById("editBtn");
const editPopup = document.getElementById("EditPopupForm");

// Add event listener to the button
editBtn.addEventListener("click", function() {
    // Toggle the visibility of the popup form
    editPopup.style.display = "block"; // Show the popup
});
