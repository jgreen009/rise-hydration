import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CinematicVideo() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const overlayRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(window.devicePixelRatio, 2)

    function resize() {
      canvas.width = 1280 * DPR
      canvas.height = 720 * DPR
    }
    resize()

    const droplets = Array.from({ length: 70 }).map(() => ({
      x: 640 + (Math.random() - 0.5) * 80,
      y: 360 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.5) * 9 - 2,
      r: 3 + Math.random() * 12,
      life: 1,
      hue: Math.random() < 0.5 ? 200 : 350
    }))

    let start = null
    let raf
    let cinProgress = 0

    function drawFrame(now) {
      if (!start) start = now
      const elapsed = (now - start) % 5000
      const tProgress = Math.min(1, cinProgress * 1.3)
      const burst = Math.max(0, (elapsed - 1200) / 800)

      ctx.save()
      ctx.fillStyle = '#020610'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const radius = Math.max(1, 320 * (0.6 + tProgress * 0.4))

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.7)
      grad.addColorStop(0, 'rgba(60,90,140,0.55)')
      grad.addColorStop(0.5, 'rgba(20,30,60,0.35)')
      grad.addColorStop(1, 'rgba(0,0,8,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Spotlight
      const lg = ctx.createRadialGradient(cx, cy - 100, 80, cx, cy, radius)
      lg.addColorStop(0, 'rgba(255,255,255,0.5)')
      lg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = lg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Can body
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(DPR, DPR)

      const canW = 90
      const canH = 260 * (1 + Math.sin(elapsed/1500) * 0.04)
      const canPassiveW = 1 - tProgress * 0.25

      ctx.fillStyle = '#990F4B'
      ctx.fillRect(-canW / 2 * canPassiveW, -canH / 2, canW * canPassiveW, canH)

      const hlGrad = ctx.createLinearGradient(-canW / 2, 0, canW / 2, 0)
      hlGrad.addColorStop(0, 'rgba(255,255,255,0)')
      hlGrad.addColorStop(0.4, 'rgba(255,255,255,0.25)')
      hlGrad.addColorStop(0.55, 'rgba(255,255,255,0.05)')
      hlGrad.addColorStop(0.65, 'rgba(255,255,255,0.20)')
      hlGrad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = hlGrad
      ctx.fillRect(-canW / 2 * canPassiveW, -canH / 2, canW * canPassiveW, canH)

      // Top rim
      ctx.fillStyle = '#d0d0d8'
      ctx.beginPath()
      ctx.ellipse(0, -canH / 2, (canW / 2) * canPassiveW, 7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#9a9aa0'
      ctx.beginPath()
      ctx.ellipse(0, -canH / 2 + 2, (canW / 2 - 4) * canPassiveW, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#707078'
      ctx.beginPath()
      ctx.ellipse(0, canH / 2, (canW / 2) * canPassiveW, 6, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px Helvetica, Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('RISE', 0, -30)

      ctx.restore()

      // Water burst
      if (burst > 0) {
        ctx.save()
        ctx.scale(DPR, DPR)
        droplets.forEach((d) => {
          d.x += d.vx * burst
          d.y += d.vy * burst + burst * burst * 6
          d.life = Math.max(0, 1 - burst * 0.8)
          ctx.fillStyle = `hsla(${d.hue}, 80%, 65%, ${d.life * 0.7})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, Math.max(0.1, d.r * d.life), 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = `hsla(${d.hue}, 80%, 80%, ${d.life * 0.4})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - d.vx * burst * 2, d.y - d.vy * burst * 2)
          ctx.stroke()
        })
        ctx.restore()
      }

      if (burst >= 1) {
        start = null
        droplets.forEach((d) => {
          d.x = 640 / DPR + (Math.random() - 0.5) * 80
          d.y = 360 / DPR + (Math.random() - 0.5) * 80
          d.vx = (Math.random() - 0.5) * 9
          d.vy = (Math.random() - 0.5) * 9 - 2
          d.life = 1
        })
      }

      ctx.restore()
      raf = requestAnimationFrame(drawFrame)
    }

    raf = requestAnimationFrame(drawFrame)

    if (window.innerWidth < 768) {
      const cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
      }
      return cleanup
    }

    const ctx2 = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            cinProgress = self.progress
            const scale = 1 + self.progress * 1.5
            const opa = 0.4 + self.progress * 0.6
            gsap.set(frameRef.current, { scale, opacity: opa })
            gsap.set(overlayRef.current, { opacity: self.progress })
            gsap.set(headlineRef.current, { y: -self.progress * 180, opacity: self.progress })
            gsap.set(subRef.current, { opacity: Math.max(0, self.progress * 1.4 - 0.4) })
          }
        }
      })
    }, sectionRef)

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      ctx2.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#020610]">
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
        <div ref={frameRef} className="overflow-hidden rounded-2xl" style={{ width: '90vw', maxWidth: 1280, aspectRatio: '16/9' }}>
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </div>

      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/10 to-black/80 opacity-0" />

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
        <h2 ref={headlineRef} className="h-display px-6 text-5xl md:text-8xl opacity-0">
          Liquid, <span className="italic font-light text-white/70">capture</span> in motion.
        </h2>
        <p ref={subRef} className="mt-6 max-w-md text-sm md:text-base text-white/70 opacity-0">
          Slow-motion reveals what instinct already knows — RISE moves like water, lands like light.
        </p>
        <span className="label-mono absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40">RISE // Fluid Study 04</span>
      </div>
    </section>
  )
}
