import useScrollReveal from '../hooks/useScrollReveal'

export default function Footer() {
  const ref = useScrollReveal({ threshold: 0.15 })

  return (
    <footer className="footer reveal fade-up" ref={ref}>
      <div className="footer-content">
        <div className="footer-brand">
          <h3>AKUA</h3>
          <p>India's freshest online fish market</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">FAQs</a>
          </div>
          <div>
            <h4>Categories</h4>
            <a href="#">Saltwater</a>
            <a href="#">Freshwater</a>
            <a href="#">Shellfish</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Delivery Info</a>
            <a href="#">Returns</a>
            <a href="#">Track Order</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 AKUA Fish Market. All rights reserved.</p>
      </div>
    </footer>
  )
}
