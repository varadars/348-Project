// instanceForm.js
const addButtonEl = document.getElementById('add-btn');
addButtonEl.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission
    returnItemData();
});

function returnItemData() {
    const brand = document.getElementById('brand').value;
    const unit_price = document.getElementById('unit_price').value;
    const quantity = document.getElementById('quantity').value;
    const store = 1;

    // Check if the opener exists and has the expected function
    if (window.opener && window.opener.pushToInstance) {
        const itemId = getQueryParam('itemId');
        window.opener.pushToInstance({brand, quantity, unit_price, itemId, store});
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
