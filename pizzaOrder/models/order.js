const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Order = sequelize.define('Order', {
  size: {
    type: DataTypes.ENUM('S', 'M', 'L', 'XL'),
    allowNull: false
  },
  toppings: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('New', 'Processing', 'Completed'),
    defaultValue: 'New'
  }
});

module.exports = Order;