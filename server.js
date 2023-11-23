// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./db/db');
const bodyParser = require('body-parser');

const User = require('./models/user');
const { getAllUsers } = require('./db/manual');


app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/api/data', async (req, res) => {
  try {
    //const query = "SELECT * FROM users";

    //const results = await db.executeQuery(query, []);

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

//add new function
// Function to insert data into the 'users' table
async function insertUserData(userData) {
  try {
    const insertQuery = `
      INSERT INTO users (username, email, password)
      VALUES (?,?,?);
    `;

    await db.connection.query(insertQuery, [userData.username, userData.email, userData.password]);

    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

async function createTables() {
    try {
      // Define and execute SQL queries to create tables
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL
        );
      `;
  
      await db.executeQuery(createTableQuery, []);
  
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  createTables();
});

// API endpoint to handle inserting data
app.post('/api/insert', (req, res) => {
  const userData = req.body; // Assuming the request body contains user data
  //console.log(req.body)
  insertUserData(userData);
  res.send('Data insertion initiated');
});
