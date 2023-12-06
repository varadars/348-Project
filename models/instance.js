const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Item = require('./item');
const Store = require('./store');

const Instance = sequelize.define('Instance', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Foreign key to Item model
  item_id: {
    type: DataTypes.INTEGER, // Adjust the data type based on the type of Item's primary key
    allowNull: false,
  },
  // Foreign key to Store model
  store_id: {
    type: DataTypes.INTEGER, // Adjust the data type based on the type of Store's primary key
    allowNull: false,
  },
});

// Function to insert data into the 'instances' table
async function insertInstanceData(instanceData) {
  try {
    const newInstance = await Instance.create(instanceData);
    return newInstance.toJSON();
  } catch (error) {
    console.error('Error inserting instance:', error);
    throw error;
  }
}

sequelize.sync();

module.exports = {
  Instance,
  insertInstanceData,
};
