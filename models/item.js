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
  },
  // Foreign key to category model
  category_id: {
    type: DataTypes.INTEGER, // Adjust the data type based on the type of Item's primary key
    allowNull: false,
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

async function updateItemOnGroceryList(itemName, onGroceryListValue) {
  try {
    const updatedItem = await Item.update(
      {
        on_grocery_list: onGroceryListValue,
        last_edited_for_list: new Date(), // Set to the current time
      },
      { where: { item_name: itemName } }
    );

    if (updatedItem[0] === 1) {
      console.log(`Item "${itemName}" updated on grocery list.`);
      return true;
    } else {
      console.log(`Item "${itemName}" not found or not updated.`);
      return false;
    }
  } catch (error) {
    console.error('Error updating item on grocery list:', error);
    throw error;
  }
}

// Sync the model with the database
sequelize.sync();

module.exports = {
    Item,
    insertItemData,
    updateItemOnGroceryList,
};
