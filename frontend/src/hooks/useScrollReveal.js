import { useEffect, useRef } from 'react'

/**
 * useScrollReveal — triggers a CSS class when element enters viewport.
 * Uses two observers to prevent glitchy flicker:
 *   - "enter" observer: adds 'revealed' when element is partially visible
 *   - "exit" observer:  removes 'revealed' only when element is fully out of view
 *
 * @param {Object} options
 * @param {number}  options.threshold  — 0-1, how much must be visible to reveal (default 0.15)
 * @param {string}  options.rootMargin — IntersectionObserver rootMargin (default '0px 0px -60px 0px')
 * @param {boolean} options.once       — animate only the first time (default false)
 * @returns {React.RefObject}
 */
export default function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  once = false,
} = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('revealed')
      return
    }

    // Enter observer — triggers reveal when element crosses threshold
    const enterObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed')
          if (once) {
            enterObserver.unobserve(el)
            exitObserver.unobserve(el)
          }
        }
      },
      { threshold, rootMargin }
    )

    // Exit observer — only removes 'revealed' when element is FULLY out of view
    // threshold: 0 means callback fires when it goes from any visibility to zero
    const exitObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !once) {
          el.classList.remove('revealed')
        }
      },
      { threshold: 0, rootMargin: '0px' }
    )

    enterObserver.observe(el)
    if (!once) exitObserver.observe(el)

    return () => {
      enterObserver.disconnect()
      exitObserver.disconnect()
    }
  }, [threshold, rootMargin, once])

  return ref
}

/**
 * useScrollRevealChildren — reveals child elements with stagger.
 * Adds 'revealed' to the container; children use CSS transition-delay via nth-child.
 */
export function useScrollRevealChildren({
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  once = false,
} = {}) {
  return useScrollReveal({ threshold, rootMargin, once })
}
