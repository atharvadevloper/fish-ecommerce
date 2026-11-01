const express = require('express')
const { db } = require('../db')
const { authenticate, adminOnly } = require('../middleware/auth')

const router = express.Router()

// All admin routes require authentication + admin role
router.use(authenticate, adminOnly)

// ===== DASHBOARD STATS =====
router.get('/stats', (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count
    const activeProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('customer').count
    const totalRevenue = db.prepare('SELECT COALESCE(SUM(total), 0) as sum FROM orders WHERE status != ?').get('cancelled').sum
    const recentOrders = db.prepare(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
    ).all()
    const lowStock = db.prepare(
      'SELECT id, name, stock FROM products WHERE stock < 10 AND is_active = 1 ORDER BY stock ASC'
    ).all()

    res.json({
      stats: { totalProducts, activeProducts, totalOrders, totalUsers, totalRevenue },
      recentOrders,
      lowStock,
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Failed to load stats.' })
  }
})

// ===== PRODUCT MANAGEMENT =====

// GET /api/admin/products — all products (including inactive)
router.get('/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all()
  res.json({ products })
})

// POST /api/admin/products — add new product
router.post('/products', (req, res) => {
  try {
    const { name, category, price, stock, image, description, freshness, quantity_unit } = req.body
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Name, category and price are required.' })
    }

    const result = db.prepare(`
      INSERT INTO products (name, category, price, stock, image, description, freshness, quantity_unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, price, stock || 0, image || '', description || '', freshness || '', quantity_unit || 'per kg')

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json({ message: 'Product added!', product })
  } catch (err) {
    console.error('Add product error:', err)
    res.status(500).json({ error: 'Failed to add product.' })
  }
})

// PUT /api/admin/products/:id — update product
router.put('/products/:id', (req, res) => {
  try {
    const { name, category, price, stock, image, description, freshness, quantity_unit, is_active } = req.body
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })

    db.prepare(`
      UPDATE products SET
        name = ?, category = ?, price = ?, stock = ?, image = ?,
        description = ?, freshness = ?, quantity_unit = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name ?? product.name,
      category ?? product.category,
      price ?? product.price,
      stock ?? product.stock,
      image ?? product.image,
      description ?? product.description,
      freshness ?? product.freshness,
      quantity_unit ?? product.quantity_unit,
      is_active ?? product.is_active,
      req.params.id,
    )

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    res.json({ message: 'Product updated!', product: updated })
  } catch (err) {
    console.error('Update product error:', err)
    res.status(500).json({ error: 'Failed to update product.' })
  }
})

// DELETE /api/admin/products/:id — delete product
router.delete('/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found.' })

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
    res.json({ message: 'Product deleted.' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ error: 'Failed to delete product.' })
  }
})

// POST /api/admin/products/bulk — bulk update products
router.post('/products/bulk', (req, res) => {
  try {
    const { updates } = req.body
    // updates = [{ id, field, value }, ...]
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided.' })
    }

    const allowedFields = ['name', 'category', 'price', 'stock', 'image', 'description', 'freshness', 'quantity_unit', 'is_active']

    const updateProduct = db.transaction((updates) => {
      let count = 0
      for (const u of updates) {
        if (!u.id || !u.field || !allowedFields.includes(u.field)) continue
        db.prepare(`UPDATE products SET ${u.field} = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .run(u.value, u.id)
        count++
      }
      return count
    })

    const count = updateProduct(updates)
    res.json({ message: `${count} product(s) updated.`, count })
  } catch (err) {
    console.error('Bulk update error:', err)
    res.status(500).json({ error: 'Bulk update failed.' })
  }
})

// ===== ORDER MANAGEMENT =====

// GET /api/admin/orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
    for (const order of orders) {
      order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.order_id)
    }
    res.json({ orders })
  } catch (err) {
    console.error('Orders error:', err)
    res.status(500).json({ error: 'Failed to load orders.' })
  }
})

// PUT /api/admin/orders/:orderId/status
router.put('/orders/:orderId/status', (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' })
    }

    const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(req.params.orderId)
    if (!order) return res.status(404).json({ error: 'Order not found.' })

    db.prepare('UPDATE orders SET status = ? WHERE order_id = ?').run(status, req.params.orderId)
    res.json({ message: `Order status updated to ${status}.` })
  } catch (err) {
    console.error('Order status error:', err)
    res.status(500).json({ error: 'Failed to update order status.' })
  }
})

// ===== USER MANAGEMENT =====
router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC').all()
    res.json({ users })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load users.' })
  }
})

module.exports = router
