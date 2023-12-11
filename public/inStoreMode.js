
document.addEventListener('DOMContentLoaded', async () => {
    const fetchString = `/api/allstores`;
    const response = await fetch(fetchString);
    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }

    const divEl = document.getElementById('storeList');
    const data = await response.json();
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        var x = document.createElement("BUTTON");
        var t = document.createTextNode(data[i]["store_name"]);
        x.appendChild(t);
        divEl.appendChild(x);

        x.addEventListener('click', function () {
            const store_name = data[i]["store_name"];
            console.log(data[i]["store_name"]);
            const formPageURL = `shopList.html?storeName=${encodeURIComponent(store_name)}`;
            const formWindow = window.open(formPageURL, 'Shop Page');
        })
    }
});

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
    const dropdownContainer = document.getElementById('dropdown-list');
    if (!dropdownContainer.contains(event.target)) {
      hideDropdown();
    }

    storeEl.addEventListener("keypress", async function(event) {
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        let store_name = storeEl.value;
        let store_iden = await getOrCreateStoreId(store_name);
        const formPageURL = `shopList.html?storeName=${encodeURIComponent(store_name)}`;
        const formWindow = window.open(formPageURL, 'Shop Page');
      }
    })
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

async function getOrCreateStoreId(storeName) {
  try {
    const response = await fetch(`/api/getOrCreateStoreId/${storeName}`);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.store_id;
  } catch (error) {
    console.error('Error getting or creating store ID:', error.message);
    throw error;
  }
}

storeEl.addEventListener('input', (event) => {
    showDropdown();
});
