import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem('akua_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

// ===== STAT CARD =====
function StatCard({ label, value, icon }) {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-icon">{icon}</span>
      <div>
        <p className="admin-stat-value">{value}</p>
        <p className="admin-stat-label">{label}</p>
      </div>
    </div>
  )
}

// ===== PRODUCT FORM MODAL =====
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || 'Freshwater',
    price: product?.price || '',
    stock: product?.stock || 0,
    image: product?.image || '',
    description: product?.description || '',
    freshness: product?.freshness || '',
    quantity_unit: product?.quantity_unit || 'per kg',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = isEdit
        ? `${API}/api/admin/products/${product.id}`
        : `${API}/api/admin/products`
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      if (res.ok) {
        onSave()
        onClose()
      }
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-grid">
            <div className="auth-field">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Freshwater</option>
                <option>Saltwater</option>
                <option>Shellfish</option>
              </select>
            </div>
            <div className="auth-field">
              <label>Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div className="auth-field">
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
            </div>
            <div className="auth-field">
              <label>Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="auth-field">
              <label>Freshness</label>
              <input value={form.freshness} onChange={(e) => setForm({ ...form, freshness: e.target.value })} placeholder="Farm Fresh" />
            </div>
            <div className="auth-field" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="auth-submit" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== MAIN ADMIN DASHBOARD =====
export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [editProduct, setEditProduct] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [bulkField, setBulkField] = useState('price')
  const [bulkValue, setBulkValue] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    if (tab === 'dashboard') loadStats()
    if (tab === 'products') loadProducts()
    if (tab === 'orders') loadOrders()
    if (tab === 'users') loadUsers()
  }, [tab])

  const loadStats = async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: authHeaders() })
      const data = await res.json()
      setStats(data)
    } catch (err) { console.error(err) }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/api/admin/products`, { headers: authHeaders() })
      const data = await res.json()
      setProducts(data.products)
    } catch (err) { console.error(err) }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, { headers: authHeaders() })
      const data = await res.json()
      setOrders(data.orders)
    } catch (err) { console.error(err) }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/users`, { headers: authHeaders() })
      const data = await res.json()
      setUsers(data.users)
    } catch (err) { console.error(err) }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await fetch(`${API}/api/admin/products/${id}`, { method: 'DELETE', headers: authHeaders() })
    loadProducts()
  }

  const updateOrderStatus = async (orderId, status) => {
    await fetch(`${API}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    })
    loadOrders()
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedIds.length === products.length) setSelectedIds([])
    else setSelectedIds(products.map((p) => p.id))
  }

  const applyBulkEdit = async () => {
    if (selectedIds.length === 0 || !bulkValue) return
    const updates = selectedIds.map((id) => ({ id, field: bulkField, value: bulkField === 'price' || bulkField === 'stock' ? Number(bulkValue) : bulkValue }))
    await fetch(`${API}/api/admin/products/bulk`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ updates }),
    })
    setBulkValue('')
    setSelectedIds([])
    loadProducts()
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>AKUA</h2>
          <span className="admin-badge">Admin</span>
        </div>
        <nav className="admin-nav">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: '📊' },
            { key: 'products', label: 'Products', icon: '🐟' },
            { key: 'orders', label: 'Orders', icon: '📦' },
            { key: 'users', label: 'Users', icon: '👥' },
          ].map((item) => (
            <button
              key={item.key}
              className={`admin-nav-btn${tab === item.key ? ' active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={onLogout}>Logout</button>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* ===== DASHBOARD TAB ===== */}
        {tab === 'dashboard' && stats && (
          <>
            <h2 className="admin-page-title">Dashboard</h2>
            <div className="admin-stats-grid">
              <StatCard icon="🐟" label="Total Products" value={stats.stats.totalProducts} />
              <StatCard icon="✅" label="Active Products" value={stats.stats.activeProducts} />
              <StatCard icon="📦" label="Total Orders" value={stats.stats.totalOrders} />
              <StatCard icon="👥" label="Customers" value={stats.stats.totalUsers} />
              <StatCard icon="💰" label="Revenue" value={`₹${stats.stats.totalRevenue.toLocaleString('en-IN')}`} />
            </div>
            {stats.lowStock.length > 0 && (
              <div className="admin-section">
                <h3>Low Stock Alert</h3>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead><tr><th>Product</th><th>Stock Left</th></tr></thead>
                    <tbody>
                      {stats.lowStock.map((p) => (
                        <tr key={p.id}><td>{p.name}</td><td className="stock-low">{p.stock}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== PRODUCTS TAB ===== */}
        {tab === 'products' && (
          <>
            <div className="admin-page-header">
              <h2 className="admin-page-title">Products</h2>
              <button className="auth-submit" onClick={() => setShowAddProduct(true)}>+ Add Product</button>
            </div>

            {/* Bulk edit bar */}
            {selectedIds.length > 0 && (
              <div className="bulk-bar">
                <span>{selectedIds.length} selected</span>
                <select value={bulkField} onChange={(e) => setBulkField(e.target.value)}>
                  <option value="price">Price</option>
                  <option value="stock">Stock</option>
                  <option value="category">Category</option>
                  <option value="freshness">Freshness</option>
                </select>
                <input
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder={`New ${bulkField}...`}
                  className="bulk-input"
                />
                <button className="auth-submit" onClick={applyBulkEdit}>Apply</button>
                <button className="btn-secondary" onClick={() => setSelectedIds([])}>Clear</button>
              </div>
            )}

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" checked={selectedIds.length === products.length && products.length > 0} onChange={selectAll} /></th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className={!p.is_active ? 'row-inactive' : ''}>
                      <td><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td className={p.stock < 10 ? 'stock-low' : ''}>{p.stock}</td>
                      <td><span className={`status-badge ${p.is_active ? 'active' : 'inactive'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="action-cell">
                        <button className="btn-sm btn-edit" onClick={() => setEditProduct(p)}>Edit</button>
                        <button className="btn-sm btn-delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(showAddProduct || editProduct) && (
              <ProductModal
                product={editProduct}
                onClose={() => { setShowAddProduct(false); setEditProduct(null) }}
                onSave={loadProducts}
              />
            )}
          </>
        )}

        {/* ===== ORDERS TAB ===== */}
        {tab === 'orders' && (
          <>
            <h2 className="admin-page-title">Orders</h2>
            {orders.length === 0 ? (
              <p className="admin-empty">No orders yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.order_id}>
                        <td className="order-id">{o.order_id}</td>
                        <td>{o.customer_name}</td>
                        <td>₹{o.total?.toLocaleString('en-IN')}</td>
                        <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                        <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.order_id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ===== USERS TAB ===== */}
        {tab === 'users' && (
          <>
            <h2 className="admin-page-title">Users</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td><span className={`status-badge ${u.role}`}>{u.role}</span></td>
                      <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
