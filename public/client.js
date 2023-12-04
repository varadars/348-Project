// client.js
const insertButton = document.getElementById('add-button');
const responseElement = document.getElementById('shopping-list');
const inputFieldEl = document.getElementById('input-field');

document.addEventListener('DOMContentLoaded', () => {
  renderList();
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
  await newItemForm(inputFieldEl.value);
  inputFieldEl.value = "";
}

async function pushToDB(data){
  try {
    const itemDataforInsert = {
      item_name: data.itemName,
      unit: data.unit,
      min_viable_quantity: data.quant,
      on_grocery_list: true,
    };

    inputFieldEl.value = "";
    
    const response = await fetch('/api/insert', {
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
    if (data.length > 0) {
        // Display data on the HTML page      

        for(let i = 0; i < data.length; i++){
          let listItemEl = document.createElement("li")
          
          listItemEl.innerHTML = `<li class="item"> ${data[i]["item_name"]} </li> <li class="day"> since ${getRelativeDate(data[i]["last_edited_for_list"])} </li>`
          
          listItemEl.addEventListener("dblclick", function() {
            // Use a valid and unique identifier for each user
            let item_name = data[i]["item_name"];

            // Use the correct path for deletion
            addOrRemoveFromGL(item_name, 0);

            //remove the list item
            listItemEl.remove();
          })
          
          responseElement.append(listItemEl)
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
      window.pushToDB = async function(unit, quant) {
        await pushToDB({itemName, unit, quant});
        renderList();
      }
    }
  } catch (error) {
    console.error('Error checking item existence:', error);
    //responseElement.textContent = 'Error checking item existence.';
  }
}

function getRelativeDate(dateFromRow) {
  let dateString = "";
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let day = new Date(dateFromRow);
  //console.log(day);

  const oneWeekAgo = new Date();
  //oneWeekAgo.setDate(currentDate.getDate() - 7);

  return weekday[day.getDay()];
}

