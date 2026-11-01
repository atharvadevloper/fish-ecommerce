const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { db, seedDatabase } = require('./db')
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const { authenticate } = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Seed database with mock data on first run
const mockData = require('./data/mockData.json')
seedDatabase(mockData.products)

// ===== PUBLIC ROUTES =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AKUA Fish Market API is running!' })
})

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE is_active = 1 ORDER BY id').all()
  res.json({ products, total: products.length })
})

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM products WHERE is_active = 1 ORDER BY category').all()
  res.json({ categories: rows.map(r => r.category) })
})

app.get('/api/products/category/:category', (req, res) => {
  const filtered = db.prepare(
    'SELECT * FROM products WHERE LOWER(category) = LOWER(?) AND is_active = 1'
  ).all(req.params.category)
  res.json({ products: filtered, total: filtered.length })
})

// ===== ORDER (public — logged-in or guest) =====
app.post('/api/orders', (req, res) => {
  try {
    const { items, customer } = req.body
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' })
    }

    const orderId = 'ORD-' + Date.now()
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    db.prepare(`
      INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, customer_address, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      customer?.name || 'Guest',
      customer?.email || '',
      customer?.phone || '',
      customer?.address || '',
      total,
    )

    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)'
    )
    for (const item of items) {
      insertItem.run(orderId, item.id, item.name, item.quantity, item.price)
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      order: { id: orderId, items, total, status: 'pending', createdAt: new Date().toISOString() },
    })
  } catch (err) {
    console.error('Order error:', err)
    res.status(500).json({ error: 'Failed to place order.' })
  }
})

// ===== AUTH ROUTES =====
app.use('/api/auth', authRoutes)

// ===== ADMIN ROUTES =====
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`AKUA Fish Market API running on http://localhost:${PORT}`)
})
