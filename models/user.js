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

// Function to delete a user by primary key
async function deleteUserById(userId) {
  try {
    const deletedUser = await User.destroy({
      where: {
        id: userId,
      },
    });
    return deletedUser; // Returns the number of rows deleted (0 or 1)
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

module.exports = {
  User,
  insertUserData,
  deleteUserById,
};
