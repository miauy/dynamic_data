const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Customer = require('../models/customer');

// List all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: Customer
    });
    res.render('orders/index', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show order details
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: Customer
    });
    res.render('orders/details', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create new order form
router.get('/create', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.render('orders/create', { customers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Create new order (optimized version)
router.post('/', async (req, res) => {
  try {
    // Convert toppings array to comma-separated string
    const toppings = Array.isArray(req.body.toppings) 
      ? req.body.toppings.join(', ')
      : req.body.toppings || '';
    
    // Calculate total if not provided
    const basePrices = { S: 8, M: 10, L: 12, XL: 14 };
    const toppingsCount = req.body.toppings ? 
      (Array.isArray(req.body.toppings) ? req.body.toppings.length : 1) 
      : 0;
    const calculatedTotal = basePrices[req.body.size] + (toppingsCount * 0.5);
    
    await Order.create({
      CustomerId: req.body.CustomerId,
      size: req.body.size,
      toppings: toppings,
      notes: req.body.notes,
      total: req.body.total || calculatedTotal.toFixed(2),
      status: 'New'
    });
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order: ' + error.message);
  }
});

// Edit order form
router.get('/:id/edit', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    const customers = await Customer.findAll();
    res.render('orders/edit', { order, customers });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update order
router.post('/:id', async (req, res) => {
  try {
    // Handle toppings array for updates
    const toppings = Array.isArray(req.body.toppings) 
      ? req.body.toppings.join(', ')
      : req.body.toppings || order.toppings;
    
    await Order.update({
      CustomerId: req.body.CustomerId,
      size: req.body.size,
      toppings: toppings,
      notes: req.body.notes,
      total: req.body.total,
      status: req.body.status
    }, {
      where: { id: req.params.id }
    });
    res.redirect(`/orders/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete order
router.post('/:id/delete', async (req, res) => {
  try {
    await Order.destroy({
      where: { id: req.params.id }
    });
    res.redirect('/orders');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;