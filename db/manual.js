// db/manualQueries.js
const sequelize = require('./sequelize');

// Example of a manual query
async function shopList() {
  try {
    const [results] = await sequelize.query('SELECT * FROM items WHERE on_grocery_list = true order by last_edited_for_list');
    return results;
  } catch (error) {
    console.error('Error executing shoplist query:', error);
    throw error;
  }
}

async function shopListStore(storeName) {
  try {
    const [results] = await sequelize.query('SELECT * FROM items WHERE on_grocery_list = true');
    return results;
  } catch (error) {
    console.error('Error executing shopliststore query:', error);
    throw error;
  }
}

module.exports = {
  shopList,
  shopListStore
};
