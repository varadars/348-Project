const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Category = sequelize.define('Category', {
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category_icon: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  category_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Function to insert data into the 'categories' table
async function insertCategoryData(categoryData) {
    try {
      const newCategory = await Category.create(categoryData);
      return newCategory.toJSON();
    } catch (error) {
      console.error('Error inserting category:', error);
      throw error;
    }
  }
  
// Sync the model with the database
sequelize.sync();

module.exports = {
    Category,
    insertCategoryData,
};
