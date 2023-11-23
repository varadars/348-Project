// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db/db');
const bodyParser = require('body-parser');

const { insertUserData } = require('./models/user');
const { getAllUsers } = require('./db/manual');
const sequelize = require('./db/sequelize');


app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
  try {

    // Using Sequelize model to fetch users
    //const sequelizeUsers = await User.findAll();

    // Using manual query function to fetch users
    const manualQueryUsers = await getAllUsers();

    //console.log(sequelizeUsers)
    res.json(manualQueryUsers);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  sequelize.sync();
});

// API endpoint to handle inserting data
app.post('/api/insert', async (req, res) => {
  try {
    userData = req.body;
    const insertedUser = await insertUserData(userData); // Assuming the request body contains user data
    console.log('Data inserted successfully:', insertedUser);
    res.json({ message: 'Data insertion initiated', insertedUser });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
