const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER, // You can use INTEGER or UUID based on your requirements
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category_icon: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  category_type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "good"
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
