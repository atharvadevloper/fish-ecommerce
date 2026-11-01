const initSqlJs = require('sql.js')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'akua.db')

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// ===== Wrapper to mimic better-sqlite3 API =====
// sql.js returns arrays of objects from db.exec but has no .prepare().get()/.all()/.run()
// We build a thin wrapper so the rest of the code doesn't change.

let _db = null
let _SQL = null

function saveDb() {
  if (_db) {
    const data = _db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(DB_PATH, buffer)
  }
}

// Auto-save every 30 seconds
setInterval(saveDb, 30000)

// Save on exit
process.on('exit', saveDb)
process.on('SIGINT', () => { saveDb(); process.exit() })
process.on('SIGTERM', () => { saveDb(); process.exit() })

// Wrapper object that exposes .prepare(), .exec(), .transaction()
const db = {
  prepare(sql) {
    return {
      run(...params) {
        const stmt = _db.prepare(sql)
        stmt.bind(params)
        stmt.step()
        stmt.free()
        saveDb()
        // Mimic better-sqlite3 run result
        const lastId = _db.exec('SELECT last_insert_rowid() as id')
        const changes = _db.exec('SELECT changes() as c')
        return {
          lastInsertRowid: lastId[0]?.values[0]?.[0] || 0,
          changes: changes[0]?.values[0]?.[0] || 0,
        }
      },
      get(...params) {
        const stmt = _db.prepare(sql)
        stmt.bind(params)
        if (stmt.step()) {
          const cols = stmt.getColumnNames()
          const vals = stmt.get()
          stmt.free()
          const row = {}
          cols.forEach((c, i) => { row[c] = vals[i] })
          return row
        }
        stmt.free()
        return undefined
      },
      all(...params) {
        const stmt = _db.prepare(sql)
        stmt.bind(params)
        const rows = []
        const cols = stmt.getColumnNames()
        while (stmt.step()) {
          const vals = stmt.get()
          const row = {}
          cols.forEach((c, i) => { row[c] = vals[i] })
          rows.push(row)
        }
        stmt.free()
        return rows
      },
    }
  },
  exec(sql) {
    _db.run(sql)
    saveDb()
  },
  transaction(fn) {
    return function (...args) {
      _db.run('BEGIN TRANSACTION')
      try {
        const result = fn(...args)
        _db.run('COMMIT')
        saveDb()
        return result
      } catch (err) {
        _db.run('ROLLBACK')
        throw err
      }
    }
  },
}

// ===== INIT (async) =====
async function initDatabase() {
  _SQL = await initSqlJs()

  // Load existing DB or create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH)
    _db = new _SQL.Database(fileBuffer)
  } else {
    _db = new _SQL.Database()
  }

  // Enable foreign keys
  _db.run('PRAGMA foreign_keys = ON')

  // Create tables
  _db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  _db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      image TEXT,
      description TEXT,
      freshness TEXT,
      quantity_unit TEXT DEFAULT 'per kg',
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  _db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT,
      customer_email TEXT,
      customer_phone TEXT,
      customer_address TEXT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  _db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `)

  saveDb()
  console.log('Database initialized at', DB_PATH)
}

// ===== SEED DEFAULT ADMIN + PRODUCTS =====
function seedDatabase(mockProducts) {
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin')
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run('Admin', 'admin@akua.in', hashedPassword, 'admin')
    console.log('Default admin created: admin@akua.in / admin123')
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get()
  if (productCount.count === 0 && mockProducts) {
    const insertMany = db.transaction((products) => {
      for (const p of products) {
        db.prepare(`
          INSERT INTO products (name, category, price, stock, image, description, freshness, quantity_unit, rating, reviews)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(p.name, p.category, p.price, p.stock, p.image, p.description, p.freshness, p.quantity_unit, p.rating, p.reviews)
      }
    })
    insertMany(mockProducts)
    console.log(`Seeded ${mockProducts.length} products`)
  }
}

module.exports = { db, seedDatabase, initDatabase }
