const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;

const Customer = require('./customer');
const Order = require('./order');

// Set up associations
Customer.hasMany(Order);
Order.belongsTo(Customer);