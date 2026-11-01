import { useState, useEffect, useRef } from 'react'
import useScrollReveal from './hooks/useScrollReveal'
import './App.css'
import './auth-admin.css'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import Footer from './components/Footer'
import ShopByCollection from './components/ShopByCollection'
import BestSellers from './components/BestSellers'
import FeaturedCombos from './components/FeaturedCombos'
import Login from './components/Login'
import Register from './components/Register'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [activePage, setActivePage] = useState('home')
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [navHidden, setNavHidden] = useState(false)
  const lastScrollY = useRef(0)
  const scrollTimer = useRef(null)
  const shippingRef = useScrollReveal({ threshold: 0.1 })
  const shippingCardsRef = useScrollReveal({ threshold: 0.1 })

  // Auth state
  const [user, setUser] = useState(null)

  // Restore auth from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('akua_token')
      const savedUser = localStorage.getItem('akua_user')
      if (savedToken && savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {}
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    // Redirect admin to admin dashboard, regular user to home
    if (userData.role === 'admin') {
      setActivePage('admin')
    } else {
      setActivePage('home')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('akua_token')
    localStorage.removeItem('akua_user')
    setActivePage('home')
  }

  // Bottom nav fade on scroll — mobile only
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 599
    const handleScroll = () => {
      if (!isMobile()) return
      const currentY = window.scrollY
      if (currentY > lastScrollY.current + 10) {
        setNavHidden(true) // scrolling down → fade out
      } else if (currentY < lastScrollY.current - 10) {
        setNavHidden(false) // scrolling up → fade back in
      }
      lastScrollY.current = currentY
      // Also bring it back after user stops scrolling
      clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => setNavHidden(false), 1500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimer.current)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
    try {
      const savedCart = localStorage.getItem('fishCart')
      if (savedCart) setCart(JSON.parse(savedCart))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('fishCart', JSON.stringify(cart)) } catch (e) {}
  }, [cart])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      const data = await response.json()
      setProducts(data.products)
    } catch (error) {

    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return }
    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const handleNavClick = (page) => {
    setActivePage(page)
  }

  // If on admin page and user is admin, show admin dashboard
  if (activePage === 'admin' && user?.role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return (
    <div className={`app${navHidden ? ' nav-hidden' : ''}`}>
      <Header
        cartCount={cartItemCount}
        onCartClick={() => setActivePage(activePage === 'cart' ? 'home' : 'cart')}
        onNavClick={handleNavClick}
        activePage={activePage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-wrapper">
        {activePage === 'home' && <Hero />}
        {activePage === 'home' && (
          <div className="ocean-depth">
            <div className="ocean-depth-inner" />
            <div className="ocean-caustics" />
            <div className="ocean-particles">
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="particle" style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${6 + Math.random() * 10}s`,
                  animationDelay: `${Math.random() * 8}s`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  opacity: 0.2 + Math.random() * 0.4,
                }} />
              ))}
            </div>
            <ShopByCollection onCollectionClick={(cat) => {
              setActiveCategory(cat)
              setActivePage('shop')
            }} />
            <BestSellers onAddToCart={addToCart} />
            <FeaturedCombos />
          </div>
        )}
        {activePage === 'shop' && (
          <div className="main-content">
            <ProductList
              products={filteredProducts}
              loading={loading}
              onAddToCart={addToCart}
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        )}
        {activePage === 'cart' && (
          <div className="main-content">
            <Cart
              cartItems={cart}
              onRemove={removeFromCart}
              onUpdateQuantity={updateQuantity}
              onBackToShop={() => setActivePage('shop')}
            />
          </div>
        )}
        {activePage === 'shipping' && (
          <div className="main-content">
            <div className="shipping-page">
              <div className="reveal fade-up" ref={shippingRef}>
                <h2>Shipping Information</h2>
                <p>We deliver fresh fish across India with ice-packed packaging.</p>
              </div>
              <div className="shipping-info reveal fade-up stagger-children" ref={shippingCardsRef}>
                <div className="shipping-card">
                  <h3>Same Day Delivery</h3>
                  <p>Available in select cities. Order before 12 PM.</p>
                </div>
                <div className="shipping-card">
                  <h3>Standard Delivery</h3>
                  <p>1-3 business days. Free on orders above &#8377;500.</p>
                </div>
                <div className="shipping-card">
                  <h3>Ice-Packed</h3>
                  <p>All orders shipped in insulated boxes with ice packs.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activePage === 'login' && (
          <div className="main-content">
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => setActivePage('register')}
            />
          </div>
        )}
        {activePage === 'register' && (
          <div className="main-content">
            <Register
              onLogin={handleLogin}
              onSwitchToLogin={() => setActivePage('login')}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
