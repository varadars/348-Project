// itemForm.js
const addButtonEl = document.getElementById('add-btn');
addButtonEl.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission
    returnItemData();
});

function returnItemData() {
    const itemNameEl = document.getElementById('var');
    const unit = document.getElementById('unit').value;
    const minViableQuantity = document.getElementById('min-viable-quantity').value;

    // Check if the opener exists and has the expected function
    if (window.opener && window.opener.pushToDB) {
        window.opener.pushToDB(unit, minViableQuantity);
        window.close(); // Close the current window
    } else {
        console.error('Error: Unable to return item data to the opener.');
    }
}

function navigateTo(page) {
    // Redirect to the selected page
    window.location.href = page;
}

function getQueryParam(name) {
    // Function to get query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
