const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Item = sequelize.define('Item', {
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_viable_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  on_grocery_list: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Default value for the boolean column
  },
  last_edited_for_list: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
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

async function checkIfItemExists(itemName) {
  try {
    const item = await Item.findOne({
      where: {
        item_name: itemName,
      },
    });

    // If item is found, it exists
    if (item) {
      console.log(`Item "${itemName}" exists.`);
      return true;
    } else {
      console.log(`Item "${itemName}" does not exist.`);
      return false;
    }
  } catch (error) {
    console.error('Error checking item existence:', error);
    throw error;
  }
}
  
// Sync the model with the database
sequelize.sync();

module.exports = {
    Item,
    insertItemData,
    checkIfItemExists,
};
