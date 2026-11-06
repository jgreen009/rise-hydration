import React, { useEffect, useRef } from 'react'

const PARTICLES = [
  { src: '/assets/ingredients/droplet.svg', size: [22, 38], count: 14, speed: 0.3 },
  { src: '/assets/ingredients/lime-slice.svg', size: [40, 64], count: 3, speed: 0.18 },
  { src: '/assets/ingredients/berry.svg', size: [40, 60], count: 3, speed: 0.22 },
  { src: '/assets/ingredients/mango.svg', size: [40, 60], count: 2, speed: 0.18 },
  { src: '/assets/ingredients/blue-raspberry.svg', size: [36, 50], count: 3, speed: 0.2 },
  { src: '/assets/ingredients/ice.svg', size: [30, 50], count: 4, speed: 0.25 },
  { src: '/assets/ingredients/electrolyte.svg', size: [20, 32], count: 8, speed: 0.45 },
  { src: '/assets/ingredients/splash.svg', size: [50, 80], count: 3, speed: 0.15 }
]

export default function FloatingParticles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const items = Array.from(container.querySelectorAll('.particle'))

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let mx = 0
    let my = 0
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      mx += (mouseX - mx) * 0.05
      my += (mouseY - my) * 0.05

      items.forEach((el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = mx - cx
        const dy = my - cy
        const dist = Math.hypot(dx, dy) || 1
        const force = Math.max(0, (180 - dist) / 180)
        const tx = -(dx / dist) * force * 22
        const ty = -(dy / dist) * force * 22
        const baseX = parseFloat(el.dataset.bx) || 0
        const baseY = parseFloat(el.dataset.by) || 0
        el.style.transform = `translate3d(${baseX + tx}px, ${baseY + ty}px, 0) rotate(${baseX * 0.3}deg)`
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {PARTICLES.flatMap((p) =>
        Array.from({ length: p.count }).map((_, i) => {
          const size = p.size[0] + Math.random() * (p.size[1] - p.size[0])
          const x = Math.random() * 100
          const y = Math.random() * 100
          const bx = (Math.random() - 0.5) * 60
          const by = (Math.random() - 0.5) * 60
          const delay = Math.random() * 6
          const duration = 8 + Math.random() * 10
          const opacity = 0.25 + Math.random() * 0.4
          return (
            <img
              key={`${p.src}-${i}`}
              src={p.src}
              alt=""
              className="particle absolute will-change-transform"
              data-bx={bx}
              data-by={by}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                opacity,
                animation: `drift${(i % 3) + 1} ${duration}s ease-in-out ${delay}s infinite`,
                filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.15))'
              }}
            />
          )
        })
      )}
    </div>
  )
}
