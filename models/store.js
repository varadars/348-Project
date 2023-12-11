const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Store = sequelize.define('Store', {
  store_id: {
    type: DataTypes.INTEGER, // You can use INTEGER or UUID based on your requirements
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  store_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensuring store_name is unique
  },
  profile_pic: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  label_image: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
});

// Function to insert data into the 'stores' table
async function insertStoreData(storeData) {
  try {
    const newStore = await Store.create(storeData);
    return newStore.toJSON();
  } catch (error) {
    console.error('Error inserting store:', error);
    throw error;
  }
}

// Sync the model with the database
sequelize.sync();

module.exports = {
  Store,
  insertStoreData,
};
