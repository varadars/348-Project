// client.js
const insertButton = document.getElementById('add-button');
const responseElement = document.getElementById('shopping-list');
const inputFieldEl = document.getElementById('input-field');

document.addEventListener('DOMContentLoaded', () => {
  renderList();
});

insertButton.addEventListener('click', async function() {
  await pushToDB();
  await renderList();
});

inputFieldEl.addEventListener("keypress", async function(event) {
  if(event.key === "Enter"){
    await pushToDB();
    await renderList();
  }
});

async function pushToDB(){
  try {
    await newItemForm(inputFieldEl.value);
    
    const itemDataforInsert = {
      item_name: inputFieldEl.value,
      unit: "items",
      min_viable_quantity: 3,
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

async function deleteItemFromList(itemId) {
  try {
    const response = await fetch(`/api/users/${itemId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    console.log('User deletion result:', result);
  } catch (error) {
    console.error('Error deleting user:', error);
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
            let userId = data[i]["id"];

            // Use the correct path for deletion
            deleteUser(userId);

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
      console.log("update value")
    } else {
      navigateTo('itemForm.html')
    }
  } catch (error) {
    console.error('Error checking item existence:', error);
    responseElement.textContent = 'Error checking item existence.';
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

function navigateTo(page) {
  // Redirect to the selected page
  window.location.href = page;
}
  