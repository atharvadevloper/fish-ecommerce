import useScrollReveal from '../hooks/useScrollReveal';

function RevealRow({ children, direction, reverse }) {
  const ref = useScrollReveal({ threshold: 0.12 })
  return (
    <div ref={ref} className={`sc-row ${reverse ? 'sc-row--reverse' : ''} reveal ${direction}`}>
      {children}
    </div>
  )
}

export default function ShopByCollection({ onCollectionClick }) {
  const collections = [
    {
      id: 'freshwater',
      eyebrow: 'Featured Collection',
      title: 'Freshwater Elegance',
      desc: 'Discover our handpicked selection of vibrant freshwater fish — from striking Bettas to graceful Discus. Each fish is healthy, well-conditioned, and ready to transform your aquarium.',
      hashtag: '#FreshwaterFavorites #AquariumGoals',
      cta: 'Shop Now',
      category: 'Freshwater',
      svg: (
        <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background circle */}
          <circle cx="240" cy="200" r="170" fill="#EAF4F4" opacity="0.12"/>
          <circle cx="240" cy="200" r="130" fill="#B0D8D2" opacity="0.08"/>

          {/* Large Betta fish */}
          <ellipse cx="230" cy="190" rx="60" ry="38" fill="#68B0A4" opacity="0.65"/>
          <path d="M180 170c12-30 50-42 76-30s34 38 24 58-42 28-68 16S168 200 180 170z" fill="#3D8578" opacity="0.55"/>
          {/* Flowing tail */}
          <path d="M170 188c-22 0-40 18-32 36 18-8 30-18 32-36z" fill="#68B0A4" opacity="0.45"/>
          <path d="M175 170c-14-22-6-46 12-52 12 18 10 38-12 52z" fill="#68B0A4" opacity="0.35"/>
          <path d="M178 210c-16 16-14 38 0 48 14-16 16-32 0-48z" fill="#68B0A4" opacity="0.3"/>
          {/* Dorsal fin */}
          <path d="M210 158c-4-18 6-32 18-34 8 14 2 28-18 34z" fill="#3D8578" opacity="0.3"/>
          {/* Eye */}
          <circle cx="268" cy="178" r="7" fill="#1e4f47"/>
          <circle cx="270" cy="176" r="2.5" fill="#EAF4F4" opacity="0.6"/>
          {/* Mouth */}
          <path d="M280 188c4 2 8 2 12 0" stroke="#1e4f47" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>

          {/* Small tetra school */}
          <ellipse cx="340" cy="130" rx="18" ry="10" fill="#68B0A4" opacity="0.4"/>
          <path d="M322 130c-5-3-8 0-8 3 4 0 6-1 8-3z" fill="#3D8578" opacity="0.3"/>
          <circle cx="352" cy="128" r="2" fill="#1e4f47" opacity="0.5"/>
          <path d="M334 126h14" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

          <ellipse cx="360" cy="155" rx="16" ry="9" fill="#68B0A4" opacity="0.35"/>
          <path d="M344 155c-4-3-7 0-7 3 3 0 5-1 7-3z" fill="#3D8578" opacity="0.25"/>
          <circle cx="370" cy="153" r="2" fill="#1e4f47" opacity="0.4"/>

          <ellipse cx="330" cy="160" rx="14" ry="8" fill="#68B0A4" opacity="0.3"/>
          <circle cx="339" cy="158" r="1.5" fill="#1e4f47" opacity="0.4"/>

          {/* Plants at bottom */}
          <path d="M120 350c4-40 2-80 16-110 4 34 4 76-16 110z" fill="#68B0A4" opacity="0.3"/>
          <path d="M145 348c2-34 8-64 22-90 -4 30-8 60-22 90z" fill="#3D8578" opacity="0.25"/>
          <path d="M350 350c-2-30 4-56 16-78 0 26-4 52-16 78z" fill="#68B0A4" opacity="0.25"/>
          <path d="M370 348c-1-24 2-48 12-68 0 22-4 46-12 68z" fill="#B0D8D2" opacity="0.2"/>

          {/* Bubbles */}
          <circle cx="300" cy="100" r="6" fill="#B0D8D2" opacity="0.25"/>
          <circle cx="315" cy="80" r="4" fill="#B0D8D2" opacity="0.2"/>
          <circle cx="290" cy="75" r="3" fill="#B0D8D2" opacity="0.15"/>
          <circle cx="160" cy="140" r="4" fill="#B0D8D2" opacity="0.2"/>
          <circle cx="148" cy="120" r="2.5" fill="#B0D8D2" opacity="0.15"/>

          {/* Gravel */}
          <ellipse cx="240" cy="360" rx="140" ry="12" fill="#B0D8D2" opacity="0.15"/>
        </svg>
      ),
    },
    {
      id: 'saltwater',
      eyebrow: 'New Collection',
      title: 'Saltwater Wonders',
      desc: 'Explore exotic marine life — vivid Clownfish pairs, majestic Tangs, and rare reef dwellers. Premium saltwater species sourced from trusted breeders across the coast.',
      hashtag: '#MarineLife #ReefReady',
      cta: 'Shop Now',
      category: 'Saltwater',
      svg: (
        <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background */}
          <circle cx="240" cy="200" r="170" fill="#EAF4F4" opacity="0.12"/>
          <circle cx="240" cy="200" r="130" fill="#B0D8D2" opacity="0.08"/>

          {/* Large Clownfish */}
          <ellipse cx="250" cy="185" rx="55" ry="35" fill="#68B0A4" opacity="0.6"/>
          <path d="M200 165c14-20 46-26 66-16s28 30 18 46-38 18-58 8S186 185 200 165z" fill="#3D8578" opacity="0.5"/>
          {/* Stripes */}
          <path d="M228 155v60" stroke="#EAF4F4" strokeWidth="6" strokeLinecap="round" opacity="0.45"/>
          <path d="M258 160v50" stroke="#EAF4F4" strokeWidth="6" strokeLinecap="round" opacity="0.45"/>
          {/* Tail */}
          <path d="M196 185c-16-6-28 4-28 16 12-4 24-4 28-16z" fill="#3D8578" opacity="0.4"/>
          {/* Fins */}
          <path d="M230 152c-4-12 2-22 10-24 6 10 2 20-10 24z" fill="#68B0A4" opacity="0.35"/>
          <path d="M240 218c-6 10-2 20 6 24 6-10 4-18-6-24z" fill="#68B0A4" opacity="0.3"/>
          {/* Eye */}
          <circle cx="275" cy="178" r="7" fill="#1e4f47"/>
          <circle cx="277" cy="176" r="2.5" fill="#EAF4F4" opacity="0.6"/>

          {/* Small tang */}
          <ellipse cx="360" cy="240" rx="24" ry="26" fill="#68B0A4" opacity="0.4"/>
          <ellipse cx="360" cy="240" rx="20" ry="22" fill="#B0D8D2" opacity="0.3"/>
          <circle cx="370" cy="234" r="3" fill="#1e4f47" opacity="0.5"/>
          <path d="M340 240c-6-2-10 2-10 6 4 0 8-2 10-6z" fill="#3D8578" opacity="0.3"/>

          {/* Coral formations */}
          <path d="M130 340c-4-20 4-36 14-36s14 20 10 36" stroke="#B0D8D2" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
          <path d="M148 342c-3-16 3-28 10-28s10 14 8 28" stroke="#68B0A4" strokeWidth="3" strokeLinecap="round" opacity="0.25"/>
          <path d="M112 338c-2-14 2-24 8-24s8 12 6 24" stroke="#B0D8D2" strokeWidth="2.5" strokeLinecap="round" opacity="0.2"/>

          <path d="M330 350c-3-18 3-32 12-32s12 18 9 32" stroke="#B0D8D2" strokeWidth="3.5" strokeLinecap="round" opacity="0.25"/>
          <path d="M350 348c-2-14 2-24 8-24s8 12 6 24" stroke="#68B0A4" strokeWidth="3" strokeLinecap="round" opacity="0.2"/>
          <path d="M368 346c-2-10 2-18 6-18s6 10 4 18" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.2"/>

          {/* Anemone */}
          <path d="M260 330c0-14-4-26 0-36 4 10 4 22 0 36z" fill="#68B0A4" opacity="0.25"/>
          <path d="M270 332c2-12 0-24 6-34 2 12 0 24-6 34z" fill="#3D8578" opacity="0.2"/>
          <path d="M250 332c-2-12 0-24-6-34 -2 12 0 24 6 34z" fill="#B0D8D2" opacity="0.2"/>

          {/* Bubbles */}
          <circle cx="310" cy="110" r="5" fill="#B0D8D2" opacity="0.2"/>
          <circle cx="325" cy="90" r="3.5" fill="#B0D8D2" opacity="0.18"/>
          <circle cx="160" cy="130" r="4" fill="#B0D8D2" opacity="0.15"/>
          <circle cx="170" cy="110" r="2.5" fill="#B0D8D2" opacity="0.12"/>

          {/* Sand */}
          <ellipse cx="240" cy="365" rx="150" ry="10" fill="#B0D8D2" opacity="0.12"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="shop-collection">
      {collections.map((col, i) => (
        <RevealRow key={col.id} reverse={i % 2 !== 0} direction={i % 2 === 0 ? 'slide-left' : 'slide-right'}>
          <div className="sc-text">
            <span className="sc-eyebrow">{col.eyebrow}</span>
            <h2 className="sc-title">{col.title}</h2>
            <p className="sc-desc">{col.desc}</p>
            <p className="sc-hashtag">{col.hashtag}</p>
            <div className="sc-actions">
              <button
                className="sc-cta"
                onClick={() => onCollectionClick?.(col.category)}
              >
                {col.cta} <span className="sc-cta-arrow">→</span>
              </button>
              <button className="sc-explore" onClick={() => onCollectionClick?.(col.category)}>
                <span className="sc-play-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                </span>
                Explore More
              </button>
            </div>
          </div>
          <div className="sc-image">
            <div className="sc-image-inner">
              {col.svg}
            </div>
          </div>
        </RevealRow>
      ))}
    </section>
  )
}
