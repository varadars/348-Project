// db/sequelize.js
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('defaultdb', 'avnadmin', 'AVNS_c4U1D2jRVQH0NFc_xyf', {
//   host: 'cs348-project-cs348-project.a.aivencloud.com',
//   port: '23214',
//   dialect: 'mysql',
//   define: {
//     timestamps: false
//   }
// });

const sequelize = new Sequelize('***', '***', '***', {
  host: '***',
  dialect: '***',
  define: {
    timestamps: false
  }
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;
