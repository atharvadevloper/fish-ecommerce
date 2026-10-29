import { useRef, useState, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Betta Halfmoon',
    price: 299,
    tag: 'Popular',
    color: '#68B0A4',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <ellipse cx="78" cy="82" rx="28" ry="18" fill="#68B0A4" opacity="0.7"/>
        <path d="M56 72c6-14 22-18 34-12s16 18 10 28-20 14-32 8S50 86 56 72z" fill="#3D8578" opacity="0.6"/>
        <path d="M50 80c-10 0-18 8-14 16 8-4 14-8 14-16z" fill="#68B0A4" opacity="0.5"/>
        <path d="M58 64c-6-10-2-22 6-24 6 8 4 18-6 24z" fill="#68B0A4" opacity="0.4"/>
        <path d="M60 96c-8 8-6 18 0 22 6-8 8-16 0-22z" fill="#68B0A4" opacity="0.35"/>
        <circle cx="88" cy="76" r="3" fill="#1e4f47"/>
        <circle cx="89" cy="75" r="1" fill="#EAF4F4" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Neon Tetra School',
    price: 199,
    tag: 'Trending',
    color: '#B0D8D2',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <ellipse cx="70" cy="70" rx="16" ry="9" fill="#68B0A4" opacity="0.6"/>
        <ellipse cx="95" cy="85" rx="16" ry="9" fill="#68B0A4" opacity="0.5"/>
        <ellipse cx="60" cy="95" rx="16" ry="9" fill="#68B0A4" opacity="0.4"/>
        <path d="M54 70c-4-2-6 0-6 2 3 0 5-1 6-2z" fill="#3D8578" opacity="0.4"/>
        <path d="M79 85c-4-2-6 0-6 2 3 0 5-1 6-2z" fill="#3D8578" opacity="0.4"/>
        <path d="M44 95c-4-2-6 0-6 2 3 0 5-1 6-2z" fill="#3D8578" opacity="0.4"/>
        <circle cx="78" cy="68" r="1.5" fill="#1e4f47"/>
        <circle cx="103" cy="83" r="1.5" fill="#1e4f47"/>
        <circle cx="68" cy="93" r="1.5" fill="#1e4f47"/>
        <path d="M64 66h12" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <path d="M89 81h12" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <path d="M54 91h12" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Red Arowana',
    price: 4999,
    tag: 'Premium',
    color: '#3D8578',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <path d="M40 78c4-16 20-24 36-20s24 18 20 30-18 18-34 14S36 94 40 78z" fill="#3D8578" opacity="0.6"/>
        <ellipse cx="72" cy="80" rx="30" ry="18" fill="#68B0A4" opacity="0.5"/>
        <path d="M42 82c-8-4-14-1-14 4 6 0 12-1 14-4z" fill="#3D8578" opacity="0.5"/>
        <path d="M48 68c-4-6-2-14 4-16 4 6 2 12-4 16z" fill="#68B0A4" opacity="0.4"/>
        <circle cx="92" cy="76" r="4" fill="#1e4f47"/>
        <circle cx="93" cy="75" r="1.5" fill="#EAF4F4" opacity="0.5"/>
        <path d="M56 72c4-2 14-2 24 0" stroke="#3D8578" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
        <path d="M58 78c4-1 12-1 22 0" stroke="#3D8578" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Discus Blue Diamond',
    price: 1299,
    tag: 'Exotic',
    color: '#68B0A4',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <ellipse cx="78" cy="80" rx="26" ry="28" fill="#68B0A4" opacity="0.5"/>
        <ellipse cx="78" cy="80" rx="22" ry="24" fill="#B0D8D2" opacity="0.4"/>
        <path d="M56 80c0-14 10-26 22-26s22 12 22 26-10 26-22 26-22-12-22-26z" stroke="#3D8578" strokeWidth="2" fill="none" opacity="0.5"/>
        <circle cx="86" cy="74" r="3" fill="#1e4f47"/>
        <circle cx="87" cy="73" r="1" fill="#EAF4F4" opacity="0.5"/>
        <path d="M70 86c4 3 10 3 16 0" stroke="#3D8578" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M64 76c2-6 8-10 16-8" stroke="#3D8578" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Clownfish Pair',
    price: 899,
    tag: 'Best Seller',
    color: '#3D8578',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <ellipse cx="75" cy="78" rx="24" ry="16" fill="#68B0A4" opacity="0.6"/>
        <path d="M55 68c6-10 20-14 30-8s14 16 8 24-18 10-28 4S49 78 55 68z" fill="#3D8578" opacity="0.5"/>
        <path d="M65 64v28" stroke="#EAF4F4" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        <path d="M78 66v24" stroke="#EAF4F4" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
        <path d="M51 78c-6-2-10 0-10 4 4-1 8-2 10-4z" fill="#68B0A4" opacity="0.4"/>
        <circle cx="88" cy="74" r="2.5" fill="#1e4f47"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: 'Guppy Trio Pack',
    price: 149,
    tag: 'Value',
    color: '#B0D8D2',
    svg: (
      <svg viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="#EAF4F4" opacity="0.15"/>
        <ellipse cx="65" cy="68" rx="14" ry="8" fill="#68B0A4" opacity="0.55"/>
        <ellipse cx="90" cy="80" rx="14" ry="8" fill="#3D8578" opacity="0.45"/>
        <ellipse cx="70" cy="96" rx="14" ry="8" fill="#B0D8D2" opacity="0.55"/>
        <path d="M51 68c-3-2-5 0-5 2 2 0 4-1 5-2z" fill="#3D8578" opacity="0.3"/>
        <path d="M76 80c-3-2-5 0-5 2 2 0 4-1 5-2z" fill="#68B0A4" opacity="0.3"/>
        <path d="M56 96c-3-2-5 0-5 2 2 0 4-1 5-2z" fill="#3D8578" opacity="0.3"/>
        <circle cx="73" cy="66" r="1.5" fill="#1e4f47"/>
        <circle cx="98" cy="78" r="1.5" fill="#1e4f47"/>
        <circle cx="78" cy="94" r="1.5" fill="#1e4f47"/>
        <path d="M58 64c4 4 12 4 18 0" stroke="#68B0A4" strokeWidth="1.5" opacity="0.3"/>
      </svg>
    ),
  },
]

export default function BestSellers({ onAddToCart }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const headerRef = useScrollReveal({ threshold: 0.2 })
  const trackRef = useScrollReveal({ threshold: 0.1 })

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.querySelector('.bs-card')?.offsetWidth || 280
    el.scrollBy({ left: dir * (cardW + 16), behavior: 'smooth' })
  }

  return (
    <section className="best-sellers">
      <div className="bs-header reveal fade-up" ref={headerRef}>
        <h2 className="bs-title">Best Sellers</h2>
        <div className="bs-arrows">
          <button
            className={`bs-arrow ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            className={`bs-arrow ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
        </div>
      </div>

      <div className="bs-track reveal fade-up stagger-children" ref={(el) => { scrollRef.current = el; trackRef.current = el; }}>
        {BEST_SELLERS.map((fish) => (
          <div key={fish.id} className="bs-card">
            <span className="bs-tag">{fish.tag}</span>
            <div className="bs-card-img">{fish.svg}</div>
            <div className="bs-card-info">
              <h3 className="bs-card-name">{fish.name}</h3>
              <div className="bs-card-row">
                <span className="bs-card-price">₹{fish.price}</span>
                <button
                  className="bs-card-btn"
                  onClick={() => onAddToCart?.(fish)}
                >
                  + Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
