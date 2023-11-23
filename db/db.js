// db.js
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: 'cs348-project-cs348-project.a.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_c4U1D2jRVQH0NFc_xyf',
  database: 'defaultdb',
  port: 23214,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function executeQuery(query, values) {
  const [rows] = await connection.execute(query, values);
  return rows;
}


module.exports = {
  executeQuery,
  connection,
};
