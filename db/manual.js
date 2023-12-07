// db/manualQueries.js
const { col } = require('sequelize');
const sequelize = require('./sequelize');

async function orderByColumn(columnName, desc) {
  try {
    let query = `SELECT date, item_name, brand, quantity, unit, unit_price * quantity AS total FROM instances LEFT OUTER JOIN items ON instances.item_id = items.id`;
    if(columnName){
      query = `SELECT date, item_name, brand, quantity, unit, unit_price * quantity AS total
                    FROM instances
                    LEFT OUTER JOIN items ON instances.item_id = items.id
                    ORDER BY ${columnName}`;
    }
    console.log(desc);
    
    if(desc==1){
      query += " DESC"
    }
    
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    console.error('Error executing orderByColumn query:', error);
    throw error;
  }
}

module.exports = {
  orderByColumn,
};
