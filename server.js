// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db/db');
const bodyParser = require('body-parser');

const { Item, insertItemData, checkIfItemExists, updateItemOnGroceryList } = require('./models/item');
const { shopList, shopListStore } = require('./db/manual');
const sequelize = require('./db/sequelize');


app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
  try {

    // Using Sequelize model to fetch users
    //const sequelizeUsers = await Item.findAll();

    // Using manual query function to fetch users
    const manualQueryUsers = await shopList();

    //console.log(sequelizeUsers)
    res.json(manualQueryUsers);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to check if an item exists
app.get('/api/check-item/:itemName', async (req, res) => {
  const itemNameToCheck = req.params.itemName;

  try {
    const itemExists = await checkIfItemExists(itemNameToCheck);
    res.json({ exists: itemExists });
  } catch (error) {
    console.error('Error checking item existence:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/update-grocery-list/:itemName', async (req, res) => {
  const itemName = req.params.itemName;
  const onGroceryListValue = req.body.onGroceryList;

  try {
    const result = await updateItemOnGroceryList(itemName, onGroceryListValue);

    if (result) {
      res.status(200).json({ success: true, message: `Item "${itemName}" updated on grocery list.` });
    } else {
      res.status(404).json({ success: false, message: `Item "${itemName}" not found or not updated.` });
    }
  } catch (error) {
    console.error('Error updating item on grocery list:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// app.delete('/api/users/:userId', async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     //const deletedUser = await deleteUserById(userId);
//     res.json({ success: deletedUser > 0 });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  sequelize.sync();
});

// API endpoint to handle inserting data
app.post('/api/insert', async (req, res) => {
  try {
    itemData = req.body;
    const insertedItem = await insertItemData(itemData); // Assuming the request body contains user data
    console.log('Data inserted successfully:', insertedItem);
    res.json({ message: 'Data insertion initiated', insertedItem });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

