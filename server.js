// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db/db');
const bodyParser = require('body-parser');

const { Store, insertStoreData } = require('./models/store')
const { Item, insertItemData, updateItemOnGroceryList } = require('./models/item');
const { Instance, insertInstanceData} = require('./models/instance');

const { orderByColumn } = require('./db/manual');
const sequelize = require('./db/sequelize');


app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
  try {
    // Using manual query function to fetch users
    const sequelizeUsers = await Item.findAll({
      where: {
        on_grocery_list: 1
      }
    });

    res.json(sequelizeUsers);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/allitems', async (req, res) => {
  try {
    // Using Sequelize model to fetch users
    const sequelizeItems = await Item.findAll();

    //console.log(sequelizeUsers)
    res.json(sequelizeItems);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/allinstances', async (req, res) => {
  try {
    // Using Sequelize model to fetch users

    let sequelizeInstances = "";

    if(req.query.columnName != 'undefined'){
      sequelizeInstances = await orderByColumn(req.query.columnName, req.query.descVal);
      console.log(req.query.columnName);
    } else {
      sequelizeInstances = await orderByColumn();
    }
    

    //console.log(sequelizeUsers)
    res.json(sequelizeInstances);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to check if an item exists
app.get('/api/check-item/:itemName', async (req, res) => {
  const itemNameToCheck = req.params.itemName;

  try {
    const iteme = await Item.findAll({
      where: {
        item_name: itemNameToCheck
      }
    });
    
    const itemExists = iteme.length > 0;
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  sequelize.sync();
});

// API endpoint to handle inserting data
app.post('/api/insertitem', async (req, res) => {
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

// API endpoint to handle inserting data
app.post('/api/insertinstance', async (req, res) => {
  try {
    instanceData = req.body;
    const insertedInstance = await insertInstanceData(instanceData); // Assuming the request body contains user data
    console.log('Data inserted successfully:', insertedInstance);
    res.json({ message: 'Data insertion initiated', insertedInstance });
  } catch (error) {
    console.error('Error inserting instance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

