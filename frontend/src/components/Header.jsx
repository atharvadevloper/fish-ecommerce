export default function Header({ cartCount, onCartClick, onNavClick, activePage }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-text">AKUA</span>
        </div>
        <nav className="nav-pills">
          <button
            className={`nav-pill ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => onNavClick('home')}
          >
            HOME
          </button>
          <button
            className={`nav-pill ${activePage === 'shop' ? 'active' : ''}`}
            onClick={() => onNavClick('shop')}
          >
            SHOP NOW
          </button>
          <button
            className={`nav-pill ${activePage === 'shipping' ? 'active' : ''}`}
            onClick={() => onNavClick('shipping')}
          >
            SHIPPINGS
          </button>
        </nav>
        <div className="header-right">
          <button className="cart-icon-btn" onClick={onCartClick} title="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <div className="user-section">
            <div className="user-avatar"></div>
            <div className="user-text">
              <span className="user-label">NEW USER</span>
              <span className="user-login">LOGIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
