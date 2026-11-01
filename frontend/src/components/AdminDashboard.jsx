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

// ===== MINI CALENDAR =====
function MiniCalendar() {
  const [current, setCurrent] = useState(new Date())
  const today = new Date()

  const year = current.getFullYear()
  const month = current.getMonth()
  const monthName = current.toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const isToday = (d) =>
    d && d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="ad-calendar">
      <div className="ad-cal-header">
        <button className="ad-cal-arrow" onClick={prevMonth}>&lt;</button>
        <span className="ad-cal-title">{monthName}</span>
        <button className="ad-cal-arrow" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="ad-cal-grid">
        {dayLabels.map((d) => (
          <span key={d} className="ad-cal-day-label">{d}</span>
        ))}
        {cells.map((d, i) => (
          <span key={i} className={`ad-cal-day${isToday(d) ? ' today' : ''}${!d ? ' empty' : ''}`}>
            {d || ''}
          </span>
        ))}
      </div>
    </div>
  )
}

// ===== CIRCULAR PROGRESS =====
function CircularProgress({ value, label, sub }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <div className="ad-circle-card">
      <div className="ad-circle-info">
        <span className="ad-circle-label">{label}</span>
        <span className="ad-circle-sub">{sub}</span>
      </div>
      <div className="ad-circle-wrap">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e8e8e8" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke="#1e4f47" strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e4f47">{value}%</text>
        </svg>
      </div>
    </div>
  )
}

// ===== BAR CHART =====
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const yTicks = [0, Math.round(max * 0.25), Math.round(max * 0.5), Math.round(max * 0.75), max]
  return (
    <div className="ad-chart-card">
      <div className="ad-chart-head">
        <span className="ad-chart-title">Monthly Revenue</span>
      </div>
      <div className="ad-chart-body">
        <div className="ad-chart-y-axis">
          {[...yTicks].reverse().map((t, i) => (
            <span key={i} className="ad-chart-y-tick">{t >= 1000 ? `${(t / 1000).toFixed(0)}K` : t}</span>
          ))}
        </div>
        <div className="ad-chart-bars">
          {data.map((d, i) => (
            <div key={i} className="ad-bar-col">
              <div className="ad-bar-wrap">
                <div
                  className="ad-bar"
                  style={{ height: `${(d.value / max) * 100}%` }}
                  title={`₹${d.value.toLocaleString('en-IN')}`}
                />
              </div>
              <span className="ad-bar-label">{d.label}</span>
            </div>
          ))}
        </div>
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
      
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Product' : 'Add Product'}</h3>
          <button className="modal-close" onClick={onClose}>&#10005;</button>
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
              <label>Price (&#8377;) *</label>
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
    if (tab === 'dashboard') { loadStats(); loadOrders() }
    if (tab === 'products') loadProducts()
    if (tab === 'orders') loadOrders()
    if (tab === 'users') loadUsers()
  }, [tab])

  const loadStats = async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: authHeaders() })
      const data = await res.json()
      setStats(data)
    } catch (err) {  }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/api/admin/products`, { headers: authHeaders() })
      const data = await res.json()
      setProducts(data.products)
    } catch (err) {  }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch(`${API}/api/admin/orders`, { headers: authHeaders() })
      const data = await res.json()
      setOrders(data.orders)
    } catch (err) {  }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch(`${API}/api/admin/users`, { headers: authHeaders() })
      const data = await res.json()
      setUsers(data.users)
    } catch (err) {  }
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
    const updates = selectedIds.map((id) => ({
      id,
      field: bulkField,
      value: bulkField === 'price' || bulkField === 'stock' ? Number(bulkValue) : bulkValue,
    }))
    await fetch(`${API}/api/admin/products/bulk`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ updates }),
    })
    setBulkValue('')
    setSelectedIds([])
    loadProducts()
  }

  // Mock monthly revenue data for chart
  const monthlyRevenue = [
    { label: 'Jan', value: 2400 },
    { label: 'Feb', value: 3800 },
    { label: 'Mar', value: 6200 },
    { label: 'Apr', value: 4100 },
    { label: 'May', value: 5500 },
    { label: 'Jun', value: 3200 },
  ]

  const userName = JSON.parse(localStorage.getItem('akua_user') || '{}')?.name || 'Admin'

  return (
    <div className="ad-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-top">
          <div className="ad-brand">
            <span className="ad-brand-icon">&#127843;</span>
            <span className="ad-brand-name">AKUA</span>
          </div>
          <nav className="ad-nav">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>) },
              { key: 'products', label: 'Products', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>) },
              { key: 'orders', label: 'Orders', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>) },
              { key: 'users', label: 'Customers', icon: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>) },
            ].map((item) => (
              <button
                key={item.key}
                className={`ad-nav-item${tab === item.key ? ' active' : ''}`}
                onClick={() => setTab(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="ad-sidebar-bottom">
          <button className="ad-nav-item" onClick={onLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="ad-main-wrap">
        {/* Top bar */}
        <header className="ad-topbar">
          <h1 className="ad-page-title">
            {tab === 'dashboard' ? 'Dashboard' : tab === 'products' ? 'Products' : tab === 'orders' ? 'Orders' : 'Customers'}
          </h1>
          <div className="ad-topbar-right">
            <div className="ad-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search..."
              />
            </div>
            <div className="ad-topbar-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="ad-content">
          {/* ===== DASHBOARD TAB ===== */}
          {tab === 'dashboard' && stats && (
            <>
              {/* Stat cards row */}
              <div className="ad-stat-row">
                <div className="ad-stat-card ad-stat-highlight">
                  <span className="ad-stat-label">Total Revenue</span>
                  <span className="ad-stat-value">&#8377;{stats.stats.totalRevenue.toLocaleString('en-IN')}</span>
                  <span className="ad-stat-change up">&#9650; 4.2% from last month</span>
                </div>
                <div className="ad-stat-card">
                  <span className="ad-stat-label">Active Products</span>
                  <span className="ad-stat-value">{stats.stats.activeProducts.toLocaleString()}</span>
                  <span className="ad-stat-change up">&#9650; 1.7% from last month</span>
                </div>
                <div className="ad-stat-card">
                  <span className="ad-stat-label">Total Orders</span>
                  <span className="ad-stat-value">{stats.stats.totalOrders.toLocaleString()}</span>
                  <span className="ad-stat-change up">&#9650; 2.9% from last month</span>
                </div>
                <div className="ad-stat-card">
                  <span className="ad-stat-label">Customers</span>
                  <span className="ad-stat-value">{stats.stats.totalUsers.toLocaleString()}</span>
                  <span className="ad-stat-change up">&#9650; 0.9% from last month</span>
                </div>
              </div>

              {/* Chart + Calendar row */}
              <div className="ad-mid-row">
                <BarChart data={monthlyRevenue} />
                <div className="ad-mid-right">
                  <MiniCalendar />
                  <CircularProgress
                    value={65}
                    label="Sales Growth"
                    sub="&#9650; 0.9% from last month"
                  />
                </div>
              </div>

              {/* Recent orders table */}
              <div className="ad-card">
                <div className="ad-card-head">
                  <span className="ad-card-title">Recent Orders</span>
                </div>
                {orders.length === 0 ? (
                  <p className="ad-empty">No orders yet.</p>
                ) : (
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.order_id}>
                            <td className="ad-mono">{o.order_id}</td>
                            <td>{o.customer_name}</td>
                            <td>&#8377; {o.total?.toLocaleString('en-IN')}</td>
                            <td><span className={`ad-badge ${o.status}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Low stock alert */}
              {stats.lowStock.length > 0 && (
                <div className="ad-card">
                  <div className="ad-card-head">
                    <span className="ad-card-title">Low Stock Alert</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead><tr><th>Product</th><th>Stock Left</th></tr></thead>
                      <tbody>
                        {stats.lowStock.map((p) => (
                          <tr key={p.id}><td>{p.name}</td><td className="ad-stock-low">{p.stock}</td></tr>
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
              <div className="ad-tab-header">
                <button className="ad-btn-primary" onClick={() => setShowAddProduct(true)}>+ Add Product</button>
              </div>

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
                  <button className="ad-btn-primary" onClick={applyBulkEdit}>Apply</button>
                  <button className="ad-btn-ghost" onClick={() => setSelectedIds([])}>Clear</button>
                </div>
              )}

              <div className="ad-card">
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr>
                        <th><input type="checkbox" checked={selectedIds.length === products.length && products.length > 0} onChange={selectAll} /></th>
                        <th>Product Name</th>
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
                          <td className="ad-product-name">{p.name}</td>
                          <td>{p.category}</td>
                          <td>&#8377;{p.price}</td>
                          <td className={p.stock < 10 ? 'ad-stock-low' : ''}>{p.stock}</td>
                          <td><span className={`ad-badge ${p.is_active ? 'active' : 'inactive'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td className="ad-actions">
                            <button className="ad-btn-sm edit" onClick={() => setEditProduct(p)}>Edit</button>
                            <button className="ad-btn-sm delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
            <div className="ad-card">
              <div className="ad-card-head">
                <span className="ad-card-title">All Orders</span>
              </div>
              {orders.length === 0 ? (
                <p className="ad-empty">No orders yet.</p>
              ) : (
                <div className="ad-table-wrap">
                  <table className="ad-table">
                    <thead>
                      <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.order_id}>
                          <td className="ad-mono">{o.order_id}</td>
                          <td>{o.customer_name}</td>
                          <td>&#8377; {o.total?.toLocaleString('en-IN')}</td>
                          <td><span className={`ad-badge ${o.status}`}>{o.status}</span></td>
                          <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => updateOrderStatus(o.order_id, e.target.value)}
                              className="ad-status-select"
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
            </div>
          )}

          {/* ===== USERS TAB ===== */}
          {tab === 'users' && (
            <div className="ad-card">
              <div className="ad-card-head">
                <span className="ad-card-title">All Customers</span>
              </div>
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="ad-product-name">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td><span className={`ad-badge ${u.role}`}>{u.role}</span></td>
                        <td>{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
