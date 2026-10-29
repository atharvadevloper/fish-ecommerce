export default function Cart({ cartItems, onRemove, onUpdateQuantity, onBackToShop }) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const gst = subtotal * 0.18
  const delivery = subtotal > 500 ? 0 : 50
  const total = subtotal + gst + delivery

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-btn" onClick={onBackToShop}>&larr; Back to Shop</button>
        <h2>Your Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">&#128031;</div>
          <p>Your cart is empty!</p>
          <p className="empty-sub">Add some fresh fish to get started.</p>
          <button className="back-shop-btn" onClick={onBackToShop}>Browse Fish</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-unit-price">&#8377;{item.price}/{item.quantity_unit}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>&minus;</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-price">&#8377;{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                <button className="remove-btn" onClick={() => onRemove(item.id)} title="Remove">&times;</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>&#8377;{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>&#8377;{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="summary-row">
              <span>Delivery {delivery === 0 && <span className="free-tag">FREE</span>}</span>
              <span>{delivery === 0 ? '₹0.00' : `₹${delivery}.00`}</span>
            </div>
            {delivery > 0 && (
              <p className="free-delivery-hint">Add &#8377;{(500 - subtotal).toFixed(0)} more for free delivery!</p>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>&#8377;{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout &rarr;</button>
          </div>
        </>
      )}
    </div>
  )
}
