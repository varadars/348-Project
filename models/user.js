// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Function to insert data into the 'users' table
async function insertUserData(userData) {
  try {
    const newUser = await User.create(userData);
    return newUser.toJSON();
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
}

module.exports = {
  User,
  insertUserData,
};
