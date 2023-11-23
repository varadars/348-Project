// client.js
document.addEventListener('DOMContentLoaded', () => {
    const insertButton = document.getElementById('add-button');
    const responseElement = document.getElementById('shopping-list');
    const inputFieldEl = document.getElementById('input-field');
    const getDataButton = document.getElementById('get-data');

    insertButton.addEventListener('click', async () => {
      pushToDB();
    });
    
    getDataButton.addEventListener('click', async () => {
    try {
      responseElement.textContent = "Loading...";

      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Display data on the HTML page
      const data = await response.json();
      //console.log('Data from server:', data);
      responseElement.textContent = "";
      if (data.length > 0) {
          // Display data on the HTML page
          //const htmlContent = data.map(item => `<li>${JSON.stringify(item)}</li>`).join('');
          
          for(let i = 0; i < data.length; i++){
            let listItemEl = document.createElement("li")
            listItemEl.innerHTML = `<li class="item"> ${data[i]["email"]} </li> <li class="day"> since ${data[i]["username"]} </li>`
            responseElement.append(listItemEl)
          }
          // 

          // for(let i = 0; i < le_array.length; i++){
          //   console.log("here");
          //   console.log();
          // }
          
          //responseElement.innerHTML = htmlContent;
          //console.log(JSON.stringify(data))
          //responseElement.textContent = JSON.stringify(data);
      } else {
          responseElement.textContent = 'No data available';
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      responseElement.textContent = 'Error fetching data';
    }
  });
  
  async function pushToDB(){
    try {
      const userDataForInsert = {
        username: 'username',
        email: inputFieldEl.value,
        password: 'newPassword',
      };
      
      responseElement.textContent = JSON.stringify(userDataForInsert);
      console.log(inputFieldEl)
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

  function addToList(fullDatabase) {
    //shoppingListEl.innerHTML += `<li> ${leString} </li>`

    // let currentItemId = newStruct[0]
    // let currentItemName = newStruct[1][0]
    // let currentDay = newStruct[1][1]

    // currentItemName = toTitleCase(currentItemName)

    // let listItemEl = document.createElement("li")
    // listItemEl.innerHTML = `<li class="item"> ${currentItemName} </li> <li class="day"> since ${currentDay} </li>`
    // shoppingListEl.append(listItemEl)

    // listItemEl.addEventListener("dblclick", function() {
    //     let locString = `shoppingList/${currentItemId}`
    //     let firebaseLocGrocery = ref(database, locString)
    //     remove(firebaseLocGrocery)
    // })
  }

  });
  