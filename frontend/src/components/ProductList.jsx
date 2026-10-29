import ProductCard from './ProductCard'
import useScrollReveal from '../hooks/useScrollReveal'

export default function ProductList({ products, loading, onAddToCart, categories, activeCategory, onCategoryChange }) {
  const headerRef = useScrollReveal({ threshold: 0.2 })
  const gridRef = useScrollReveal({ threshold: 0.05 })

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading fresh catches...</p>
      </div>
    )
  }

  return (
    <div className="products-section">
      <div className="section-header reveal fade-up" ref={headerRef}>
        <h2>Fresh Catches</h2>
        <p>{products.length} products available</p>
      </div>
      <div className="category-tabs">
        {categories.map(cat => (
          <button key={cat} className={`category-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => onCategoryChange(cat)}>
            {cat}
          </button>
        ))}
      </div>
      {products.length === 0 ? (
        <div className="no-products"><p>No products found. Try a different category or search.</p></div>
      ) : (
        <div className="products-grid reveal fade-up stagger-children" ref={gridRef}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  )
}
