const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mockData = require('./data/mockData.json');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AKUA Fish Market API is running!' });
});

app.get('/api/products', (req, res) => {
  res.json({ products: mockData.products, total: mockData.products.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockData.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/categories', (req, res) => {
  res.json({ categories: mockData.categories });
});

app.get('/api/products/category/:category', (req, res) => {
  const filtered = mockData.products.filter(
    p => p.category.toLowerCase() === req.params.category.toLowerCase()
  );
  res.json({ products: filtered, total: filtered.length });
});

app.post('/api/orders', (req, res) => {
  const { items, customer } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in order' });
  }
  const order = {
    id: 'ORD-' + Date.now(),
    items,
    customer,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  res.status(201).json({ message: 'Order placed successfully!', order });
});

app.listen(PORT, () => {
  console.log(`AKUA Fish Market API running on http://localhost:${PORT}`);
});
