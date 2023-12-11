let sent = false;
// instanceForm.js
const addButtonEl = document.getElementById('add-btn');
const remButtonEl = document.getElementById('rem-btn');
const subtitleEl = document.getElementById('subtitle');
const brandEl = document.getElementById('brand');
const priceEl = document.getElementById('unit_price');
const quantityEl = document.getElementById('quantity');

let suggestedBrand = "";
let suggestedPrice = 0;
let suggestedQuantity = 0;

document.addEventListener("DOMContentLoaded", async function() {
    if(getQueryParam('storeName')){
        storeEl.style.display = "none";
        subtitleEl.textContent = "at " + getQueryParam('storeName');
    }
    const itemId = getQueryParam('itemId')
    const response = await fetch(`/api/mostrecentinstance/${itemId}`);
    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }
    const data = await response.json();
    if(data.length > 0){
        suggestedBrand = data[0]["brand"];
        suggestedPrice = data[0]["unit_price"];
        suggestedQuantity = data[0]["quantity"];

        brandEl.value = suggestedBrand;
        priceEl.value = suggestedPrice;
        quantityEl.value = suggestedQuantity;
    }
});

function autofillData() {
    const brand = document.getElementById('brand').value;
    const unit_price = document.getElementById('unit_price').value;
    const quantity = document.getElementById('quantity').value;
    const storeEl = document.getElementById('store');

    // Check if the opener exists and has the expected function
    if (window.opener && window.opener.pushToInstance) {
        const itemId = getQueryParam('itemId');
        const store = getQueryParam('storeName');
        storeEl.value = store;
        window.opener.pushToInstance({brand, quantity, unit_price, itemId, store});
        window.close(); // Close the current window
    } else {
        console.error('Error: Unable to return item data to the opener.');
    }
}

function returnItemData() {
    const brand = document.getElementById('brand').value;
    const unit_price = document.getElementById('unit_price').value;
    const quantity = document.getElementById('quantity').value;
    const store = document.getElementById('store').value;

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

const storeEl = document.getElementById('store');

// Close the dropdown when clicking outside of it
document.addEventListener('click', event => {
    sent = false;
    const dropdownContainer = document.getElementById('dropdown-list');
    if (!dropdownContainer.contains(event.target)) {
      hideDropdown();
    }
    
    addButtonEl.addEventListener('click', function(event) {
        if (!sent){
            event.preventDefault();
            if(getQueryParam('storeName')){
                autofillData();
            } else {
                returnItemData();
            }
            sent = true;
        }
    });
    
    remButtonEl.addEventListener('click', function(event) {
        // Check if the opener exists and has the expected function
        if (!sent) {
            console.log(window.opener.removeOnly);
            if (window.opener && window.opener.removeOnly) {
                window.opener.removeOnly();
                window.close(); // Close the current window
            } else {
                console.error('Error: Unable to return item data to the opener.');
            }
            sent = true;
        }
    });
    
});

async function showDropdown() {
    const response = await fetch('/api/allstores');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  
    // Display data on the HTML page
    const data = await response.json();
  
    let suggestions = [];
  
    for(let i = 0; i < data.length; i++){
      suggestions.push(data[i]["store_name"]);
    }
  
    //console.log(suggestions);
  
    const inputField = document.getElementById('store');
    const dropdownList = document.getElementById('dropdown-list');
  
    const inputValue = inputField.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue)
    );
  
    // Clear previous suggestions
    dropdownList.innerHTML = '';
  
    // Display filtered suggestions
    filteredSuggestions.forEach(suggestion => {
      const dropdownItem = document.createElement('div');
      dropdownItem.classList.add('dropdown-item');
      dropdownItem.textContent = suggestion;
      dropdownItem.addEventListener('click', () => {
        inputField.value = suggestion;
        hideDropdown();
      });
      dropdownList.appendChild(dropdownItem);
    });
  
    // Show the dropdown
    dropdownList.style.display = filteredSuggestions.length > 0 ? 'block' : 'none';
  }
  
function hideDropdown() {
    const dropdownList = document.getElementById('dropdown-list');
    dropdownList.style.display = 'none';
}

storeEl.addEventListener('input', (event) => {
    showDropdown();
});