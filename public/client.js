// client.js
const insertButton = document.getElementById('add-button');
const responseElement = document.getElementById('shopping-list');
const inputFieldEl = document.getElementById('input-field');

document.addEventListener('DOMContentLoaded', () => {
  renderList();
});

insertButton.addEventListener('click', async function() {
  await pushToDB();
  console.log("rendering")
  await renderList();
});

async function pushToDB(){
  try {
    const userDataForInsert = {
      username: 'username',
      email: inputFieldEl.value,
      password: 'newPassword',
    };

    inputFieldEl.value = "";
    
    const response = await fetch('/api/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataForInsert),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    console.log('Data insertion initiated');
  } catch (error) {
    console.error('Error inserting data:', error);
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
          listItemEl.innerHTML = `<li class="item"> ${data[i]["email"]} </li> <li class="day"> since ${data[i]["username"]} </li>`
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
  