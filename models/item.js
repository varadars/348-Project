const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Item = sequelize.define('Item', {
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  most_recent_unit_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_viable_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

async function insertItemData(itemData) {
    try {
      const newItem = await Item.create(itemData);
      return newItem.toJSON();
    } catch (error) {
      console.error('Error inserting item:', error);
      throw error;
    }
  }
  
// Sync the model with the database
sequelize.sync();

module.exports = {
    Item,
    insertItemData,
};
