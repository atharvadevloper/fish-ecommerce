export default function Header({ cartCount, onCartClick, onNavClick, activePage, user, onLogout }) {
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
            <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="nav-label">HOME</span>
          </button>
          <button
            className={`nav-pill ${activePage === 'shop' ? 'active' : ''}`}
            onClick={() => onNavClick('shop')}
          >
            <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="nav-label">SHOP NOW</span>
          </button>
          <button
            className={`nav-pill ${activePage === 'cart' ? 'active' : ''}`}
            onClick={onCartClick}
          >
            <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            <span className="nav-label">CART</span>
          </button>
          <button
            className={`nav-pill ${activePage === 'shipping' ? 'active' : ''}`}
            onClick={() => onNavClick('shipping')}
          >
            <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <span className="nav-label">SHIPPINGS</span>
          </button>
          <button
            className={`nav-pill nav-pill-login ${activePage === 'login' ? 'active' : ''}`}
            onClick={() => user ? onNavClick('home') : onNavClick('login')}
          >
            <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
            <span className="nav-login-label">{user ? user.name?.split(' ')[0] : 'Login'}</span>
          </button>
          {user?.role === 'admin' && (
            <button
              className={`nav-pill nav-pill-admin ${activePage === 'admin' ? 'active' : ''}`}
              onClick={() => onNavClick('admin')}
            >
              <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span className="nav-label">ADMIN</span>
            </button>
          )}
        </nav>
        <div className="header-right">
          <button className="cart-icon-btn" onClick={onCartClick} title="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {user ? (
            <div className="user-section">
              <div className="user-avatar user-avatar-logged">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="user-text">
                <span className="user-label">{user.name}</span>
                <button className="user-logout-btn" onClick={onLogout}>LOGOUT</button>
              </div>
            </div>
          ) : (
            <div className="user-section" onClick={() => onNavClick('login')} style={{ cursor: 'pointer' }}>
              <div className="user-avatar"></div>
              <div className="user-text">
                <span className="user-label">NEW USER</span>
                <span className="user-login">LOGIN</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
