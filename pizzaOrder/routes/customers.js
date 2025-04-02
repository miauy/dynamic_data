const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Order = require('../models/order');

// List all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.render('customers/index', { customers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show customer details
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: Order
    });
    res.render('customers/details', { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create new customer form
router.get('/create', (req, res) => {
  res.render('customers/create');
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    await Customer.create(req.body);
    res.redirect('/customers');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Edit customer form
router.get('/:id/edit', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    res.render('customers/edit', { customer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update customer
router.post('/:id', async (req, res) => {
  try {
    await Customer.update(req.body, {
      where: { id: req.params.id }
    });
    res.redirect(`/customers/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete customer
router.post('/:id/delete', async (req, res) => {
  try {
    await Customer.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/customers');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
    try {
      const newCustomer = await Customer.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone,
        email: req.body.email
      });
      res.redirect('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).send('Error creating customer');
    }
  });

module.exports = router;