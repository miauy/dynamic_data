const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const sequelize = require('./models/index');
const Customer = require('./models/customer');
const Order = require('./models/order');

const app = express();

// Set up Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/customers', require('./routes/customers'));
app.use('/orders', require('./routes/orders'));

//home route

app.get('/', (req, res) => {
    res.render('home');
  });

// Sync database and start server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});