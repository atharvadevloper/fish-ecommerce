import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const COMBOS = [
  {
    id: 1,
    name: 'Community Peace Tank',
    tag: 'Best Value',
    fish: ['Neon Tetra ×10', 'Corydoras ×4', 'Amano Shrimp ×6'],
    tankSize: '20 Gal',
    temperament: 'Peaceful',
    compatibility: 'High',
    price: 1299,
    originalPrice: 1899,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tank background */}
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>

        {/* Plants */}
        <path d="M60 200c4-50 2-90 18-120 4 34 4 86-18 120z" fill="#68B0A4" opacity="0.4"/>
        <path d="M80 198c2-40 8-70 22-95 -4 30-8 65-22 95z" fill="#3D8578" opacity="0.3"/>
        <path d="M320 200c-2-40 4-70 16-95 0 30-4 65-16 95z" fill="#68B0A4" opacity="0.35"/>
        <path d="M340 198c-1-30 2-55 12-78 0 25-4 55-12 78z" fill="#B0D8D2" opacity="0.3"/>

        {/* Neon Tetras school */}
        <ellipse cx="150" cy="100" rx="14" ry="7" fill="#68B0A4" opacity="0.7"/>
        <path d="M136 100c-4-2-6 0-6 2 3 0 5-1 6-2z" fill="#3D8578" opacity="0.5"/>
        <circle cx="159" cy="98" r="1.5" fill="#1e4f47"/>
        <path d="M143 97h12" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

        <ellipse cx="175" cy="115" rx="14" ry="7" fill="#68B0A4" opacity="0.6"/>
        <path d="M161 115c-4-2-6 0-6 2 3 0 5-1 6-2z" fill="#3D8578" opacity="0.4"/>
        <circle cx="184" cy="113" r="1.5" fill="#1e4f47"/>
        <path d="M168 112h12" stroke="#B0D8D2" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>

        <ellipse cx="160" cy="130" rx="12" ry="6" fill="#68B0A4" opacity="0.5"/>
        <circle cx="168" cy="128" r="1.2" fill="#1e4f47"/>

        <ellipse cx="140" cy="120" rx="12" ry="6" fill="#68B0A4" opacity="0.55"/>
        <circle cx="148" cy="118" r="1.2" fill="#1e4f47"/>

        {/* Corydoras at bottom */}
        <ellipse cx="220" cy="175" rx="16" ry="10" fill="#B0D8D2" opacity="0.6"/>
        <path d="M204 175c-4-2-7 0-7 3 3 0 5-1 7-3z" fill="#3D8578" opacity="0.4"/>
        <circle cx="230" cy="172" r="2" fill="#1e4f47"/>
        <path d="M218 180c4 2 8 1 10-1" stroke="#3D8578" strokeWidth="1" opacity="0.3"/>

        <ellipse cx="250" cy="180" rx="14" ry="9" fill="#B0D8D2" opacity="0.5"/>
        <circle cx="259" cy="177" r="1.8" fill="#1e4f47"/>

        {/* Shrimp */}
        <path d="M290 155c4-6 10-8 14-4 2 4-2 8-6 10s-10 0-8-6z" fill="#68B0A4" opacity="0.4"/>
        <path d="M300 148c2 0 4 2 4 4" stroke="#3D8578" strokeWidth="0.8" opacity="0.4"/>
        <path d="M302 148c2-1 3 0 4 2" stroke="#3D8578" strokeWidth="0.8" opacity="0.4"/>

        {/* Bubbles */}
        <circle cx="200" cy="60" r="5" fill="#B0D8D2" opacity="0.25"/>
        <circle cx="190" cy="45" r="3" fill="#B0D8D2" opacity="0.2"/>
        <circle cx="280" cy="70" r="4" fill="#B0D8D2" opacity="0.2"/>

        {/* Gravel */}
        <ellipse cx="200" cy="200" rx="150" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Betta Paradise Setup',
    tag: 'Popular',
    fish: ['Halfmoon Betta ×1', 'Kuhli Loach ×3', 'Nerite Snail ×2'],
    tankSize: '10 Gal',
    temperament: 'Semi-Peaceful',
    compatibility: 'Moderate',
    price: 899,
    originalPrice: 1299,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tank */}
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>

        {/* Plants */}
        <path d="M70 200c4-55 2-100 20-130 4 38 4 95-20 130z" fill="#68B0A4" opacity="0.45"/>
        <path d="M95 198c3-40 10-72 24-95 -4 28-10 60-24 95z" fill="#3D8578" opacity="0.3"/>
        <path d="M300 200c-3-45 5-80 18-105 0 30-5 70-18 105z" fill="#68B0A4" opacity="0.4"/>

        {/* Betta — large, dramatic */}
        <ellipse cx="200" cy="110" rx="35" ry="22" fill="#3D8578" opacity="0.6"/>
        <path d="M170 95c8-18 30-26 46-18s22 24 14 36-26 16-42 8S162 113 170 95z" fill="#68B0A4" opacity="0.55"/>
        {/* Flowing tail */}
        <path d="M168 108c-16 0-28 14-22 26 12-6 20-14 22-26z" fill="#3D8578" opacity="0.45"/>
        <path d="M172 92c-10-16-4-34 8-38 8 14 6 28-8 38z" fill="#68B0A4" opacity="0.35"/>
        <path d="M175 128c-12 12-10 28 0 36 10-12 12-24 0-36z" fill="#3D8578" opacity="0.3"/>
        {/* Dorsal */}
        <path d="M192 88c-2-12 4-22 12-24 6 10 2 20-12 24z" fill="#68B0A4" opacity="0.3"/>
        {/* Eye */}
        <circle cx="222" cy="104" r="5" fill="#1e4f47"/>
        <circle cx="224" cy="102" r="2" fill="#EAF4F4" opacity="0.5"/>

        {/* Kuhli loaches at bottom */}
        <path d="M140 185c20-4 40-2 55 2" stroke="#B0D8D2" strokeWidth="5" strokeLinecap="round" opacity="0.5"/>
        <circle cx="195" cy="185" r="2" fill="#1e4f47" opacity="0.4"/>
        <path d="M230 178c18 0 35 4 48 8" stroke="#B0D8D2" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
        <circle cx="278" cy="184" r="1.5" fill="#1e4f47" opacity="0.4"/>

        {/* Snails */}
        <circle cx="310" cy="170" r="8" fill="#B0D8D2" opacity="0.4"/>
        <circle cx="310" cy="170" r="5" fill="#68B0A4" opacity="0.3"/>
        <path d="M305 172c-3 2-5 6-4 8" stroke="#B0D8D2" strokeWidth="1.5" opacity="0.4"/>

        {/* Bubbles */}
        <circle cx="240" cy="55" r="4" fill="#B0D8D2" opacity="0.25"/>
        <circle cx="250" cy="40" r="3" fill="#B0D8D2" opacity="0.2"/>
        <circle cx="160" cy="65" r="3.5" fill="#B0D8D2" opacity="0.18"/>

        {/* Gravel */}
        <ellipse cx="200" cy="200" rx="150" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Cichlid Color Burst',
    tag: 'Premium',
    fish: ['Electric Yellow ×3', 'Red Zebra ×3', 'Blue Dolphin ×2'],
    tankSize: '55 Gal',
    temperament: 'Semi-Aggressive',
    compatibility: 'Species',
    price: 3499,
    originalPrice: 4599,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tank */}
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>

        {/* Rock formations */}
        <path d="M80 200c0-20 10-40 25-50 15-10 30 5 30 25s-5 30-25 25" fill="#B0D8D2" opacity="0.2"/>
        <path d="M280 200c0-25 12-45 28-55 16-10 32 5 32 28s-8 32-28 27" fill="#B0D8D2" opacity="0.18"/>
        <path d="M180 200c0-15 8-28 18-35 10-7 20 3 20 18s-4 22-18 17" fill="#B0D8D2" opacity="0.15"/>

        {/* Electric Yellow Cichlid */}
        <ellipse cx="130" cy="110" rx="24" ry="16" fill="#68B0A4" opacity="0.65"/>
        <path d="M110 100c6-12 20-16 30-10s14 16 8 24-18 10-28 4S104 112 110 100z" fill="#B0D8D2" opacity="0.5"/>
        <path d="M108 110c-6-2-10 0-10 4 4-1 8-2 10-4z" fill="#68B0A4" opacity="0.4"/>
        <circle cx="146" cy="106" r="3" fill="#1e4f47"/>
        <circle cx="147" cy="105" r="1" fill="#EAF4F4" opacity="0.5"/>

        {/* Red Zebra */}
        <ellipse cx="240" cy="95" rx="22" ry="15" fill="#3D8578" opacity="0.6"/>
        <path d="M222 86c5-10 18-14 26-8s12 14 6 22-16 10-24 4S217 96 222 86z" fill="#68B0A4" opacity="0.45"/>
        <path d="M230 82v28" stroke="#3D8578" strokeWidth="1.5" opacity="0.2"/>
        <path d="M240 84v26" stroke="#3D8578" strokeWidth="1.5" opacity="0.2"/>
        <path d="M250 86v22" stroke="#3D8578" strokeWidth="1.5" opacity="0.2"/>
        <path d="M220 95c-5-2-8 0-8 3 3 0 6-1 8-3z" fill="#3D8578" opacity="0.4"/>
        <circle cx="254" cy="90" r="2.5" fill="#1e4f47"/>

        {/* Blue Dolphin — larger */}
        <ellipse cx="310" cy="135" rx="28" ry="18" fill="#68B0A4" opacity="0.55"/>
        <path d="M286 122c8-14 26-20 38-12s16 20 8 30-24 14-36 6S278 136 286 122z" fill="#3D8578" opacity="0.5"/>
        {/* Nuchal hump */}
        <ellipse cx="328" cy="118" rx="10" ry="8" fill="#68B0A4" opacity="0.4"/>
        <path d="M284 135c-6-3-10 0-10 4 4 0 8-1 10-4z" fill="#68B0A4" opacity="0.4"/>
        <circle cx="332" cy="128" r="3.5" fill="#1e4f47"/>
        <circle cx="333" cy="127" r="1.2" fill="#EAF4F4" opacity="0.5"/>

        {/* More cichlids in background */}
        <ellipse cx="170" cy="155" rx="18" ry="12" fill="#B0D8D2" opacity="0.35"/>
        <circle cx="182" cy="152" r="2" fill="#1e4f47" opacity="0.4"/>

        <ellipse cx="260" cy="160" rx="16" ry="11" fill="#68B0A4" opacity="0.3"/>
        <circle cx="270" cy="157" r="1.8" fill="#1e4f47" opacity="0.35"/>

        {/* Bubbles */}
        <circle cx="200" cy="50" r="5" fill="#B0D8D2" opacity="0.22"/>
        <circle cx="150" cy="60" r="3" fill="#B0D8D2" opacity="0.18"/>
        <circle cx="300" cy="55" r="4" fill="#B0D8D2" opacity="0.2"/>

        {/* Gravel / sand */}
        <ellipse cx="200" cy="202" rx="155" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Guppy Rainbow Mix',
    tag: 'Beginner',
    fish: ['Fancy Guppy ×8', 'Cherry Shrimp ×6', 'Mystery Snail ×2'],
    tankSize: '15 Gal',
    temperament: 'Peaceful',
    compatibility: 'High',
    price: 749,
    originalPrice: 1099,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>
        <path d="M60 200c4-50 2-90 18-120 4 34 4 86-18 120z" fill="#68B0A4" opacity="0.4"/>
        <path d="M330 200c-2-40 4-70 16-95 0 30-4 65-16 95z" fill="#68B0A4" opacity="0.35"/>
        <ellipse cx="120" cy="95" rx="12" ry="7" fill="#68B0A4" opacity="0.7"/>
        <path d="M110 95c-5-3-8 0-7 3 3-1 5-2 7-3z" fill="#3D8578" opacity="0.5"/>
        <circle cx="128" cy="93" r="1.5" fill="#1e4f47"/>
        <ellipse cx="170" cy="110" rx="11" ry="6" fill="#3D8578" opacity="0.6"/>
        <path d="M161 110c-4-2-7 0-6 3 3-1 5-2 6-3z" fill="#68B0A4" opacity="0.4"/>
        <circle cx="177" cy="108" r="1.5" fill="#1e4f47"/>
        <ellipse cx="145" cy="125" rx="10" ry="6" fill="#68B0A4" opacity="0.55"/>
        <circle cx="151" cy="123" r="1.2" fill="#1e4f47"/>
        <ellipse cx="200" cy="100" rx="12" ry="7" fill="#B0D8D2" opacity="0.6"/>
        <circle cx="208" cy="98" r="1.5" fill="#1e4f47"/>
        <ellipse cx="185" cy="140" rx="10" ry="6" fill="#3D8578" opacity="0.45"/>
        <circle cx="191" cy="138" r="1.2" fill="#1e4f47"/>
        <path d="M260 165c3-5 8-7 11-3 2 3-1 7-5 8s-8 0-6-5z" fill="#3D8578" opacity="0.4"/>
        <path d="M290 160c3-5 8-7 11-3 2 3-1 7-5 8s-8 0-6-5z" fill="#68B0A4" opacity="0.35"/>
        <circle cx="100" cy="175" r="8" fill="#B0D8D2" opacity="0.4"/>
        <circle cx="100" cy="175" r="5" fill="#68B0A4" opacity="0.3"/>
        <circle cx="240" cy="55" r="4" fill="#B0D8D2" opacity="0.22"/>
        <circle cx="180" cy="45" r="3" fill="#B0D8D2" opacity="0.18"/>
        <ellipse cx="200" cy="200" rx="150" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 5,
    name: 'Planted Nano Tank',
    tag: 'Trending',
    fish: ['Ember Tetra ×8', 'Otocinclus ×3', 'Red Cherry Shrimp ×10'],
    tankSize: '10 Gal',
    temperament: 'Peaceful',
    compatibility: 'High',
    price: 999,
    originalPrice: 1499,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>
        <path d="M50 200c4-60 2-110 22-140 4 40 4 100-22 140z" fill="#3D8578" opacity="0.45"/>
        <path d="M75 198c3-45 10-80 26-105 -4 30-10 65-26 105z" fill="#68B0A4" opacity="0.4"/>
        <path d="M100 200c2-35 6-65 16-85 2 25-4 55-16 85z" fill="#3D8578" opacity="0.3"/>
        <path d="M310 200c-3-50 5-90 20-115 0 35-5 75-20 115z" fill="#68B0A4" opacity="0.45"/>
        <path d="M340 198c-2-40 3-70 14-90 0 25-4 58-14 90z" fill="#3D8578" opacity="0.35"/>
        <path d="M280 200c-2-30 4-55 14-72 0 22-4 48-14 72z" fill="#68B0A4" opacity="0.3"/>
        <ellipse cx="160" cy="100" rx="10" ry="5" fill="#68B0A4" opacity="0.65"/>
        <circle cx="167" cy="98" r="1.2" fill="#1e4f47"/>
        <ellipse cx="185" cy="110" rx="9" ry="5" fill="#68B0A4" opacity="0.55"/>
        <circle cx="191" cy="108" r="1.2" fill="#1e4f47"/>
        <ellipse cx="210" cy="95" rx="10" ry="5" fill="#3D8578" opacity="0.5"/>
        <circle cx="217" cy="93" r="1.2" fill="#1e4f47"/>
        <ellipse cx="170" cy="120" rx="9" ry="5" fill="#68B0A4" opacity="0.5"/>
        <circle cx="176" cy="118" r="1.1" fill="#1e4f47"/>
        <ellipse cx="240" cy="170" rx="14" ry="8" fill="#B0D8D2" opacity="0.5"/>
        <circle cx="250" cy="168" r="2" fill="#1e4f47" opacity="0.4"/>
        <ellipse cx="270" cy="175" rx="12" ry="7" fill="#B0D8D2" opacity="0.4"/>
        <circle cx="278" cy="173" r="1.5" fill="#1e4f47" opacity="0.4"/>
        <path d="M130 170c3-5 8-7 11-3 2 3-1 7-5 8s-8 0-6-5z" fill="#3D8578" opacity="0.35"/>
        <path d="M155 175c3-5 8-7 11-3 2 3-1 7-5 8s-8 0-6-5z" fill="#68B0A4" opacity="0.3"/>
        <circle cx="200" cy="50" r="4" fill="#B0D8D2" opacity="0.2"/>
        <circle cx="230" cy="42" r="3" fill="#B0D8D2" opacity="0.18"/>
        <ellipse cx="200" cy="200" rx="150" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id: 6,
    name: 'Discus Showpiece',
    tag: 'Expert',
    fish: ['Blue Diamond Discus ×4', 'Cardinal Tetra ×12', 'Sterbai Cory ×6'],
    tankSize: '75 Gal',
    temperament: 'Peaceful',
    compatibility: 'Moderate',
    price: 8999,
    originalPrice: 11499,
    svg: (
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="360" height="200" rx="16" fill="#EAF4F4" opacity="0.3"/>
        <rect x="30" y="30" width="340" height="180" rx="12" fill="#B0D8D2" opacity="0.15"/>
        <path d="M60 200c4-55 2-100 20-130 4 38 4 95-20 130z" fill="#68B0A4" opacity="0.4"/>
        <path d="M330 200c-3-45 5-80 18-105 0 30-5 70-18 105z" fill="#68B0A4" opacity="0.35"/>
        <circle cx="150" cy="110" r="32" fill="#3D8578" opacity="0.5"/>
        <circle cx="150" cy="110" r="26" fill="#68B0A4" opacity="0.35"/>
        <circle cx="150" cy="110" r="18" fill="#B0D8D2" opacity="0.2"/>
        <circle cx="162" cy="104" r="4" fill="#1e4f47"/>
        <circle cx="163" cy="103" r="1.5" fill="#EAF4F4" opacity="0.5"/>
        <circle cx="270" cy="100" r="28" fill="#3D8578" opacity="0.45"/>
        <circle cx="270" cy="100" r="22" fill="#68B0A4" opacity="0.3"/>
        <circle cx="270" cy="100" r="15" fill="#B0D8D2" opacity="0.2"/>
        <circle cx="280" cy="94" r="3.5" fill="#1e4f47"/>
        <circle cx="281" cy="93" r="1.3" fill="#EAF4F4" opacity="0.5"/>
        <ellipse cx="180" cy="155" rx="8" ry="4" fill="#68B0A4" opacity="0.55"/>
        <circle cx="185" cy="153" r="1" fill="#1e4f47"/>
        <ellipse cx="200" cy="148" rx="8" ry="4" fill="#68B0A4" opacity="0.5"/>
        <circle cx="205" cy="146" r="1" fill="#1e4f47"/>
        <ellipse cx="220" cy="155" rx="8" ry="4" fill="#3D8578" opacity="0.45"/>
        <circle cx="225" cy="153" r="1" fill="#1e4f47"/>
        <ellipse cx="240" cy="148" rx="7" ry="4" fill="#68B0A4" opacity="0.4"/>
        <circle cx="244" cy="146" r="1" fill="#1e4f47"/>
        <ellipse cx="120" cy="180" rx="12" ry="7" fill="#B0D8D2" opacity="0.5"/>
        <circle cx="128" cy="178" r="1.5" fill="#1e4f47" opacity="0.4"/>
        <ellipse cx="310" cy="178" rx="11" ry="7" fill="#B0D8D2" opacity="0.45"/>
        <circle cx="317" cy="176" r="1.5" fill="#1e4f47" opacity="0.4"/>
        <circle cx="200" cy="50" r="5" fill="#B0D8D2" opacity="0.22"/>
        <circle cx="310" cy="55" r="3.5" fill="#B0D8D2" opacity="0.18"/>
        <ellipse cx="200" cy="200" rx="150" ry="8" fill="#B0D8D2" opacity="0.2"/>
      </svg>
    ),
  },
]

const PAGE_SIZE = 3

function ComboCard({ combo, index }) {
  const ref = useScrollReveal({ threshold: 0.1 })

  return (
    <div
      className="fc-card reveal fade-up"
      ref={ref}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="fc-card-image">
        {combo.svg}
        <span className="fc-tag">{combo.tag}</span>
        {combo.originalPrice && (
          <span className="fc-save-badge">
            Save ₹{combo.originalPrice - combo.price}
          </span>
        )}
      </div>

      <div className="fc-card-body">
        <h3 className="fc-card-name">{combo.name}</h3>

        <div className="fc-fish-list">
          {combo.fish.map((f, i) => (
            <span key={i} className="fc-fish-chip">{f}</span>
          ))}
        </div>

        <div className="fc-specs">
          <div className="fc-spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <span>{combo.tankSize}</span>
          </div>
          <div className="fc-spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8"/></svg>
            <span>{combo.temperament}</span>
          </div>
          <div className="fc-spec">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{combo.compatibility}</span>
          </div>
        </div>

        <div className="fc-card-footer">
          <div className="fc-price-block">
            <span className="fc-price">₹{combo.price.toLocaleString('en-IN')}</span>
            {combo.originalPrice && (
              <span className="fc-original-price">₹{combo.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button className="fc-view-btn">
            View Combo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedCombos() {
  const titleRef = useScrollReveal({ threshold: 0.2 })
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(COMBOS.length / PAGE_SIZE)
  const visible = COMBOS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  const goBack = () => setPage(p => Math.max(0, p - 1))
  const goNext = () => setPage(p => Math.min(totalPages - 1, p + 1))

  return (
    <section className="featured-combos">
      <div className="fc-header reveal fade-up" ref={titleRef}>
        <p className="fc-eyebrow">Curated For You</p>
        <h2 className="fc-title">
          Featured <span className="fc-accent">Compatible Fish</span> Combos
        </h2>
        <p className="fc-subtitle">Pre-matched fish that thrive together — skip the guesswork</p>
      </div>

      <div className="fc-grid" key={page}>
        {visible.map((combo, i) => (
          <ComboCard key={combo.id} combo={combo} index={i} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="fc-pagination">
          <button
            className="fc-page-btn fc-page-back"
            onClick={goBack}
            disabled={page === 0}
            aria-label="Previous combos"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>

          <div className="fc-page-dots">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`fc-dot${i === page ? ' active' : ''}`}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="fc-page-btn fc-page-next"
            onClick={goNext}
            disabled={page === totalPages - 1}
            aria-label="Next combos"
          >
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"/></svg>
          </button>
        </div>
      )}
    </section>
  )
}
