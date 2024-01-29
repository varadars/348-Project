// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db/db');
const bodyParser = require('body-parser');

const { Store } = require('./models/store')
const { Item, insertItemData, updateItemOnGroceryList } = require('./models/item');
const { Instance, insertInstanceData} = require('./models/instance');
const { Category } = require('./models/category')

const { orderByColumn, getTrips } = require('./db/manual');
const sequelize = require('./db/sequelize');

// Create an index on the item_name column
//Item.addIndex('item_name_index', ['item_name']);

// Create a multi-column index on date, item_id, and store_id
//Instance.addIndex('date_item_store_index', ['date', 'item_id', 'store_id']);

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/mostrecentinstance/:itemId', async (req, res) => {
  try {
    const yourItemId = req.params.itemId;
    // Using manual query function to fetch users
    const recentItem = await Instance.findAll({
      where: {
        item_id: yourItemId, // Replace yourItemId with the actual value
      },
      order: [['date', 'DESC']], // Order by date in descending order
      limit: 1, // Limit to only one result (the most recent entry)
    });

    res.json(recentItem);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

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

app.get('/api/getOrCreateStoreId/:storeName', async (req, res) => {
  const storeName = req.params.storeName;

  try {
    // Check if the store already exists
    let store = await Store.findOne({
      attributes: ['store_id'],
      where: {
        store_name: storeName,
      },
    });

    if (!store) {
      // If the store doesn't exist, create a new one
      const newStore = await Store.create({
        store_name: storeName,
        // Add other properties as needed
      });

      store = newStore; // Use the newly created store
    }

    res.json({ store_id: store.store_id });
  } catch (error) {
    console.error('Error getting or creating store id:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getOrCreateCategory/:category', async (req, res) => {
  const categoryName = req.params.category;

  try {
    // Check if the store already exists
    let category = await Category.findOne({
      attributes: ['category_id'],
      where: {
        category_name: categoryName,
      },
    });

    if (!category) {
      // If the store doesn't exist, create a new one
      const newCategory = await Category.create({
        category_name: categoryName,
        // Add other properties as needed
      });

      category = newCategory; // Use the newly created store
    }

    res.json({ category_id: category.category_id });
  } catch (error) {
    console.error('Error getting or creating store id:', error);
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

app.get('/api/allcategories', async (req, res) => {
  try {
    // Using Sequelize model to fetch users
    const sequelizeCategories = await Category.findAll();

    //console.log(sequelizeUsers)
    res.json(sequelizeCategories);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/allstores', async (req, res) => {
  try {
    // Using Sequelize model to fetch users
    const sequelizeStores = await Store.findAll();

    //console.log(sequelizeUsers)
    res.json(sequelizeStores);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/gettrips', async (req, res) => {
  try {
    // Using Sequelize model to fetch users

    let trips = "";
    trips = await getTrips();
    res.json(trips);
    
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

