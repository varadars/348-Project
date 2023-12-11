// client.js
const insertButton = document.getElementById('add-button');
const responseElement = document.getElementById('shopping-list');
const notHereEl = document.getElementById("not-store-shopping-list");
const inputFieldEl = document.getElementById('input-field');
let inStore = false;
let inStoreName = "";

document.addEventListener('DOMContentLoaded', () => {
  const topBarEl = document.getElementById('topbar');
  const barTextEl = document.getElementById('topbartext');
  const subtitleEl = document.getElementById('subtitle');

  if (window.opener) {
    inStore = true;
    inStoreName = getQueryParam('storeName');
    subtitleEl.textContent = inStoreName;
    console.log(inStoreName);
  }
  console.log('reloaded dom console')
  renderList();

  if(!inStore) {
    topBarEl.style.display = "none";
    const hide1 = document.getElementById("this-store");
    const hide2 = document.getElementById("not-this-store");
    hide1.style.display = "none";
    hide2.style.display = "none";
  }
});

insertButton.addEventListener('click', async function() {
  await addItem();
});

inputFieldEl.addEventListener("keypress", async function(event) {
  if(event.key === "Enter"){
    await addItem();
  }
});

async function addItem(){
  await newItemForm(toTitleCase(inputFieldEl.value));
  inputFieldEl.value = "";
}

async function pushToDB(data){
  try {
    const cat_name = data.category;

    const categoryId = await getOrCreateCategory(cat_name);

    const itemDataforInsert = {
      item_name: data.itemName,
      unit: data.unit,
      min_viable_quantity: data.quant,
      on_grocery_list: true,
      category_id: categoryId,
    };

    inputFieldEl.value = "";
    
    const response = await fetch('/api/insertitem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemDataforInsert),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    console.log('Data insertion initiated');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function addOrRemoveFromGL(itemName, onGroceryListValue) {
  try {
    const response = await fetch(`/api/update-grocery-list/${itemName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ onGroceryList: onGroceryListValue }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
    } else {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating grocery list status:', error);
  }
}

async function renderList() {
  try {
    responseElement.textContent = "Loading...";
    console.log("in here")

    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Display data on the HTML page
    const data = await response.json();
    responseElement.textContent = "";
    notHereEl.textContent = "";
    if (data.length > 0) {
        // Display data on the HTML page      

        for(let i = 0; i < data.length; i++){
          let listItemEl = document.createElement("li")
          
          listItemEl.innerHTML = `<li class="item"> ${data[i]["item_name"]} </li> <li class="day"> ${getRelativeDate(data[i]["last_edited_for_list"])} </li>`
          
          listItemEl.addEventListener("dblclick", async function() {
            // Use a valid and unique identifier for each user
            let item_name = data[i]["item_name"];
            let itemId = data[i]["id"];

            let formPageURL = `instanceForm.html?itemId=${encodeURIComponent(itemId)}`;
            if (inStore) {
              const encodedItemId = encodeURIComponent(itemId);
              const encodedStoreName = encodeURIComponent(inStoreName);
              formPageURL = `instanceForm.html?itemId=${encodedItemId}&storeName=${encodedStoreName}`;
            }
            const formWindow = window.open(formPageURL, 'Form Page');

            window.removeOnly = async function() {
              //remove the list item
              listItemEl.remove();

              // Use the correct path for deletion
              addOrRemoveFromGL(item_name, 0);
            }
            
            window.pushToInstance = async function(data) {

              //add an instance

              //console.log(data.brand);

              let store_iden = await getOrCreateStoreId(data.store);

              const instanceDataforInsert = {
                date: new Date(),
                brand: data.brand,
                quantity: data.quantity,
                unit_price: data.unit_price,
                item_id: data.itemId,
                store_id: store_iden,
              };

              const response = await fetch('/api/insertinstance', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(instanceDataforInsert),
              });
          
              if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
              }

              //remove the list item
              listItemEl.remove();

              // Use the correct path for deletion
              addOrRemoveFromGL(item_name, 0);
            }
          })
          
          if(inStore){
            const response = await fetch(`/api/mostrecentinstance/${data[i]["id"]}`);
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            const data3 = await response.json();

            const response2 = await fetch(`/api/getOrCreateStoreId/${inStoreName}`);
            if (!response2.ok) {
              throw new Error(`Server responded with status: ${response2.status}`);
            }

            console.log(data3);

            const data2 = await response2.json();
            let lestoreId = data2.store_id;
            console.log(lestoreId);


            if(data3.length > 0){
              if (data3[0]["store_id"] == lestoreId){
                responseElement.append(listItemEl)
              } else {
                notHereEl.append(listItemEl);
              }
            } else {
              notHereEl.append(listItemEl);
            }
          } else {
            responseElement.append(listItemEl);            
          }

        }

    } else {
        responseElement.textContent = 'No data available';
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    responseElement.textContent = 'Error fetching data';
  }
}

async function newItemForm(itemName){
  try {
    const response = await fetch(`/api/check-item/${itemName}`);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.exists) {
      await addOrRemoveFromGL(itemName,1);
      renderList();
    } else {
      const formPageURL = `itemForm.html?variableName=${encodeURIComponent(itemName)}`;
      const formWindow = window.open(formPageURL, 'Form Page');
      window.pushToDB = async function(data) {
        await pushToDB(data);
        renderList();
      }
    }
  } catch (error) {
    console.error('Error checking item existence:', error);
    //responseElement.textContent = 'Error checking item existence.';
  }
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function getRelativeDate(dateFromRow) {
  let dateString = "";
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = new Date(dateFromRow);
  //console.log(day);

  return moment(dateFromRow, "").fromNow();
  //return dateFromRow;
  //return weekday[day.getDay()];
}

async function getOrCreateCategory(categoryName) {
  try {
    const response = await fetch(`/api/getOrCreateCategory/${categoryName}`);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.category_id;
  } catch (error) {
    console.error('Error getting or creating store ID:', error.message);
    throw error;
  }
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

async function showDropdown() {
  const response = await fetch('/api/allitems');
  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
  }

  // Display data on the HTML page
  const data = await response.json();

  let suggestions = [];

  for(let i = 0; i < data.length; i++){
    suggestions.push(data[i]["item_name"]);
  }

  //console.log(suggestions);

  const inputField = document.getElementById('input-field');
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

document.addEventListener('input', (event) => {
  showDropdown();
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', event => {
  const dropdownContainer = document.getElementById('dropdown-list');
  if (!dropdownContainer.contains(event.target)) {
    hideDropdown();
  }
});

function getQueryParam(name) {
  // Function to get query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}