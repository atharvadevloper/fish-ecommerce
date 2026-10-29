import AnimatedFishBg from './AnimatedFishBg';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Hero() {
  const contentRef = useScrollReveal({ threshold: 0.2 })
  const scrollRef = useScrollReveal({ threshold: 0.1 })

  return (
    <section className="hero">
      <AnimatedFishBg />
      <div className="hero-content reveal fade-up" ref={contentRef}>
        <p className="hero-brand">Premium Fish & Aquatic Plants</p>
        <p className="hero-subheading">India's #1 Fish E-Commerce</p>
        <p className="hero-tagline">Expert Care • Quality Fish • Fair Prices</p>
        <button className="hero-cta" onClick={() => {}}>Shop Fresh Fish</button>
      </div>
      <div className="scroll-indicator reveal fade-up" ref={scrollRef}>
        <div className="scroll-dot"></div>
      </div>
    </section>
  )
}
