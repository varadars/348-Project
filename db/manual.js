// db/manualQueries.js
const sequelize = require('./sequelize');

// Example of a manual query
async function getAllUsers() {
  try {
    const [results] = await sequelize.query('SELECT * FROM users');
    return results;
  } catch (error) {
    console.error('Error executing manual query:', error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
};
