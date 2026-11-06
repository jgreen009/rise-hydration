import React, { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [variant, setVariant] = useState('default')
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setHidden(false)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`
      }
    }

    const onOver = (e) => {
      const target = e.target
      const interactive = target.closest('button, a, [data-cursor="hover"], input, label')
      if (interactive) {
        setVariant('hover')
        const tone = interactive.getAttribute('data-cursor') || 'accent'
        document.documentElement.style.setProperty('--cursor-color', tone === 'light' ? '#ffffff' : getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#990F4B')
      } else {
        setVariant('default')
      }
    }

    let raf
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (hidden) return null

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block will-change-transform"
        style={{
          width: 36,
          height: 36,
          border: '1.5px solid color-mix(in srgb, var(--cursor-color, var(--accent)) 80%, transparent)',
          borderRadius: '50%',
          background: variant === 'hover' ? 'color-mix(in srgb, var(--cursor-color, var(--accent)) 18%, transparent)' : 'transparent',
          backdropFilter: 'blur(2px)',
          transition: 'background .25s ease, width .25s ease, height .25s ease, border-color .25s ease'
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden md:block will-change-transform"
        style={{
          width: 8,
          height: 8,
          background: 'var(--cursor-color, var(--accent))',
          borderRadius: '50%',
          boxShadow: '0 0 12px var(--cursor-color, var(--accent))'
        }}
      />
    </>
  )
}
