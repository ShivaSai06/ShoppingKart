const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory database
const db = {
  items: {
    '090031EB2AF9': { name: 'Milk', cost: 60.0 },
    '150026F45D9A': { name: 'Sugar', cost: 40.0 },
    '180045AF00F2': { name: 'Bread', cost: 25.0 },
    '19007EBFA27A': { name: 'Apple', cost: 80.0 },
  },
  carts: {},
  settledBills: [],
};

// Serve static HTML
app.get('/', (req, res) => {
  res.sendFile('/public/index.html');
});

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

  if (!db.carts[cartId]) {
    db.carts[cartId] = [];
  }

  const item = { ...db.items[itemId], itemId };
  db.carts[cartId].push(item);

  res.json({ message: 'success' });
});

// Remove item from cart
app.post('/remItem', (req, res) => {
  const { cartId, itemId } = req.body;
  console.log('/remItem ', cartId, itemId);

  if (!cartId || !itemId) {
    return res.status(400).json({ error: 'Missing cartId or itemId' });
  }

  if (!db.items[itemId]) {
    return res.status(400).json({ error: 'Invalid itemId' });
  }

  if (!db.carts[cartId]) {
    return res.status(400).json({ error: 'Cart not found' });
  }

  const itemIndex = db.carts[cartId].findIndex(
    (item) => item.itemId === itemId
  );

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  // Remove the item from the cart
  db.carts[cartId].splice(itemIndex, 1);

  res.json({ message: 'Item removed successfully' });
});

// Settle bill
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

// Get all carts and bills
app.get('/data', (req, res) => {
  console.log('/data');
  res.json({
    carts: db.carts,
    settledBills: db.settledBills,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
