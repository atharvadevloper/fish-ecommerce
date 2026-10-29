import { useState } from 'react'

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <span className="freshness-tag">{product.freshness}</span>
      </div>
      <div className="product-info">
        <span className="category-label">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="product-meta">
          <span className="rating">&#9733; {product.rating}</span>
          <span className="reviews">({product.reviews} reviews)</span>
          <span className="stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
        <div className="product-footer">
          <div className="price">
            <span className="amount">&#8377;{product.price}</span>
            <span className="unit">/{product.quantity_unit}</span>
          </div>
          <button className={`add-to-cart-btn ${added ? 'added' : ''}`} onClick={handleAdd} disabled={product.stock === 0}>
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
