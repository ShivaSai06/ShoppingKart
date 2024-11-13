const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// In-memory database
const db = {
  items: {
    '090031EB2AF9': { name: 'Apple', cost: '$1.00' },
    '150026F45D9A': { name: 'Banana', cost: '$0.50' },
    '180045AF00F2': { name: 'Orange', cost: '$0.75' },
    '19007EBFA27A': { name: 'Grapes', cost: '$2.00' },
  },
  carts: {},
  settledBills: [],
};

// Serve static HTML
app.get('/', (req, res) => {
  res.sendFile('/public/index.html');
});

// Add item to cart
app.post('/addItem', (req, res) => {
  const { cartId, itemId } = req.body;

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

// Settle bill
app.post('/settleBill', (req, res) => {
  const { cartId } = req.body;

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
  res.json({
    carts: db.carts,
    settledBills: db.settledBills,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
