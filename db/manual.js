// db/manualQueries.js
const { col } = require('sequelize');
const sequelize = require('./sequelize');

async function getTrips() {
  try {
    let query = `SELECT store_name, count(distinct DATE(date)) AS day
                    FROM instances JOIN stores
                    ON instances.store_id = stores.store_id
                    GROUP BY store_name
                    ORDER BY day DESC`;

    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    console.error('Error executing getTrips query:', error);
    throw error;
  }
}



async function orderByColumn(columnName, desc, whereClause) {
  try {
    let query = `SELECT date, item_name, brand, category_name AS category, quantity, unit, unit_price, unit_price * quantity AS total 
                    FROM instances 
                    JOIN items ON instances.item_id = items.id
                    JOIN categories ON items.category_id = categories.category_id`;

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    if (columnName) {
      query += ` ORDER BY ${columnName}`;
    }

    if (desc == 1) {
      query += " DESC";
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
  getTrips,
};
