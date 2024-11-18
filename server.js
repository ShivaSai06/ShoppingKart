const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// In-memory database with stock quantities
const db = {
  items: {
    '090031EB2AF9': { name: 'Milk', cost: 60.0, stock: 20 },
    '150026F45D9A': { name: 'Sugar', cost: 40.0, stock: 20 },
    '180045AF00F2': { name: 'Bread', cost: 25.0, stock: 20 },
    '19007EBFA27A': { name: 'Apple', cost: 80.0, stock: 20 },
  },
  carts: {},
  settledBills: [],
};

// Serve the main HTML page (index.html) from the 'public' folder
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Clear all carts and settled bills (for resetting the state)
app.get('/clear', (req, res) => {
  db.carts = {};
  db.settledBills = [];
  res.json({ status: 'done' });
});

// Add item to cart
app.post('/addItem', (req, res) => {
  const { cartId, itemId } = req.body;
  console.log('/addItem ', cartId, itemId);

  if (!cartId || !itemId) {
    return res.status(400).json({ error: 'Missing cartId or itemId' });
  }

  if (!db.items[itemId]) {
    return res.status(400).json({ error: 'Invalid itemId' });
  }

  // Check stock before adding item
  if (db.items[itemId].stock <= 0) {
    return res.status(400).json({ error: 'Item out of stock' });
  }

  if (!db.carts[cartId]) {
    db.carts[cartId] = [];
  }

  const item = { ...db.items[itemId], itemId };
  db.carts[cartId].push(item);

  // Decrease the stock quantity
  db.items[itemId].stock--;

  res.json({
    message: 'Item added successfully',
    stock: db.items[itemId].stock,
  });
});

// Remove item from cart
app.post('/remItem', (req, res) => {
  const { cartId, itemId } = req.body;
  console.log('Request to remove item:', { cartId, itemId });

  if (!cartId || !itemId) {
    console.error('Missing cartId or itemId');
    return res.status(400).json({ error: 'Missing cartId or itemId' });
  }

  if (!db.items[itemId]) {
    console.error('Invalid itemId:', itemId);
    return res.status(400).json({ error: 'Invalid itemId' });
  }

  if (!db.carts[cartId]) {
    console.error('Cart not found:', cartId);
    return res.status(400).json({ error: 'Cart not found' });
  }

  const itemIndex = db.carts[cartId].findIndex(
    (item) => item.itemId === itemId
  );

  if (itemIndex === -1) {
    console.error('Item not found in cart:', itemId);
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  // Remove the item from the cart
  db.carts[cartId].splice(itemIndex, 1);

  // Increase the stock quantity
  db.items[itemId].stock++;

  // Log the updated state for debugging
  console.log('Updated cart for cartId:', cartId, db.carts[cartId]);
  console.log('Updated stock for itemId:', itemId, db.items[itemId].stock);

  res.json({
    message: 'Item removed successfully',
    cart: db.carts[cartId], // Updated cart
    stock: db.items[itemId].stock, // Updated stock
  });
});

// Settle the bill for a cart
app.post('/settleBill', (req, res) => {
  const { cartId } = req.body;
  console.log('/settleBill ', cartId);

  if (!cartId || !db.carts[cartId]) {
    return res.status(400).json({ error: 'Invalid cartId' });
  }

  const cartItems = db.carts[cartId];
  const total = cartItems.reduce((sum, item) => sum + item.cost, 0);

  const settledBill = {
    cartId,
    items: cartItems,
    total,
    timestamp: new Date().toLocaleString(),
  };

  db.settledBills.push(settledBill);
  delete db.carts[cartId];

  res.json({ message: 'success' });
});

// Get all carts, bills, and stock quantities
app.get('/data', (req, res) => {
  console.log('/data');
  res.json({
    carts: db.carts,
    settledBills: db.settledBills,
    stockQuantities: db.items,
  });
});

// **New Endpoint**: Get current stock for all items
app.get('/stock', (req, res) => {
  console.log('/stock');
  const stockData = Object.entries(db.items).map(([itemId, item]) => ({
    itemId,
    name: item.name,
    stock: item.stock,
  }));

  res.json(stockData);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
