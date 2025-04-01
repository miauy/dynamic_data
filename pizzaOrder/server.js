const express = require('express');
const app = express();
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const handlebars = require('express-handlebars');

// Database setup
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: console.log
});

// Customer Model with simplified validation
const Customer = sequelize.define('Customer', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: {
    type: DataTypes.STRING,
    validate: {
      len: [5, 10],
      isNumeric: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15],
      is: /\d{10}/
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  }
});

// Order Model
const Order = sequelize.define('Order', {
  size: {
    type: DataTypes.ENUM('S', 'M', 'L', 'XL'),
    allowNull: false
  },
  toppings: DataTypes.STRING,
  notes: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('New', 'Processing', 'Completed'),
    defaultValue: 'New'
  }
});

// Relationships
Customer.hasMany(Order);
Order.belongsTo(Customer);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => res.render('home'));

// Customer Routes
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.render('customers/list', { customers });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error loading customers' });
  }
});

app.get('/customers/new', (req, res) => res.render('customers/form', { customer: null }));

app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) throw new Error('Customer not found');
    res.render('customers/details', { customer });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Customer not found' });
  }
});

app.get('/customers/:id/edit', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) throw new Error('Customer not found');
    res.render('customers/form', { customer });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error loading customer' });
  }
});

app.post('/customers', async (req, res) => {
    try {
      await Customer.create(req.body);
      res.redirect('/customers');
    } catch (error) {
      console.error('Validation errors:', error.errors);
      res.render('customers/form', {
        customer: req.body,
        errors: error.errors || [{ message: 'An error occurred' }]
      });
    }
  });

app.post('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) throw new Error('Customer not found');
    await customer.update(req.body);
    res.redirect('/customers');
  } catch (error) {
    console.error(error);
    res.render('customers/form', { 
      customer: req.body, 
      errors: error.errors 
    });
  }
});

app.post('/customers/:id/delete', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) throw new Error('Customer not found');
    await customer.destroy();
    res.redirect('/customers');
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error deleting customer' });
  }
});

// Order Routes
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: Customer });
    res.render('orders/list', { orders });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error loading orders' });
  }
});

app.get('/orders/new', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.render('orders/form', { order: null, customers });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error loading form' });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: Customer });
    if (!order) throw new Error('Order not found');
    res.render('orders/details', { order });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Order not found' });
  }
});

app.get('/orders/:id/edit', async (req, res) => {
  try {
    const [order, customers] = await Promise.all([
      Order.findByPk(req.params.id),
      Customer.findAll()
    ]);
    if (!order) throw new Error('Order not found');
    res.render('orders/form', { order, customers });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error loading order' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    await Order.create(req.body);
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    const customers = await Customer.findAll();
    res.render('orders/form', { 
      order: req.body, 
      customers,
      errors: error.errors 
    });
  }
});

app.post('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new Error('Order not found');
    await order.update(req.body);
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    const customers = await Customer.findAll();
    res.render('orders/form', { 
      order: req.body, 
      customers,
      errors: error.errors 
    });
  }
});

app.post('/orders/:id/delete', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new Error('Order not found');
    await order.destroy();
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Error deleting order' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});