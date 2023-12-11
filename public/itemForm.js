// itemForm.js
const addButtonEl = document.getElementById('add-btn');
const categoryEl = document.getElementById('category');
let sent = false;


// Close the dropdown when clicking outside of it
document.addEventListener('click', event => {
    sent = false;
    const dropdownContainer = document.getElementById('dropdown-list');
    if (!dropdownContainer.contains(event.target)) {
      hideDropdown();
    }
    addButtonEl.addEventListener('click', function(event) {
        if(!sent){
          event.preventDefault(); // Prevent the default form submission
          returnItemData();
          sent = true;
        }

    });
});

async function showDropdown() {
    const response = await fetch('/api/allcategories');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  
    // Display data on the HTML page
    const data = await response.json();
  
    let suggestions = [];
  
    for(let i = 0; i < data.length; i++){
      suggestions.push(data[i]["category_name"]);
    }
  
    //console.log(suggestions);
  
    const inputField = document.getElementById('category');
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

categoryEl.addEventListener('input', (event) => {
    showDropdown();
});

function returnItemData() {
    const category = document.getElementById('category').value;
    const unit = document.getElementById('unit').value;
    const quant = 1;

    // Check if the opener exists and has the expected function
    if (window.opener && window.opener.pushToDB) {
        const itemName = getQueryParam('variableName');
        window.opener.pushToDB({itemName, unit, quant, category});
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
