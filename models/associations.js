// associations.js
const Item = require('./item');
const Store = require('./store');
const Instance = require('./instance');

// Define Associations

// Instance.belongsTo(Item, {as: 'Item', foreignKey: 'itemId'});
// Instance.belongsTo(Store, {as: 'Store', foreignKey: 'storeId'});

Instance.belongsTo(Item);
Instance.belongsTo(Store);

Item.hasMany(Instance);
Store.hasMany(Instance);

module.exports = {
  Item,
  Store,
  Instance,
};
