import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { createCan, setCanFlavor, getFlavors } from '../three/CanModel.js'

gsap.registerPlugin(ScrollTrigger)

const FLAVORS = [
  { key: 'berry', name: 'Berry', subtitle: 'Acai · Blueberry · Pomegranate', color: '#D72E4E', glow: 'rgba(215,46,78,0.4)',
    copy: 'A brooding dark wave. Bold enough for the bold, gentle enough to draw you back.' },
  { key: 'lime', name: 'Lime Citrus', subtitle: 'Citrus · Mint · Sea Salt', color: '#56D93E', glow: 'rgba(86,217,62,0.4)',
    copy: 'A cool, electric note. Crisp and bright enough to clear the mind on a steep climb.' },
  { key: 'mango', name: 'Mango Citrus', subtitle: 'Citrus · Passion · Turmeric', color: '#FF9A1F', glow: 'rgba(255,154,31,0.4)',
    copy: 'Golden and luminous. Sun-warmed and quietly radiant, like late afternoon.' },
  { key: 'blue', name: 'Blue Raspberry', subtitle: 'Wild Berry · Electric Charge', color: '#2F8DFF', glow: 'rgba(47,141,255,0.45)',
    copy: 'Electric and unusual. A high-voltage closer for the moment that needs the most.' }
]

export default function FlavorExperience() {
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const titleRef = useRef(null)
  const copyRef = useRef(null)
  const subtitleRef = useRef(null)
  const indexRef = useRef(null)
  const glowRef = useRef(null)
  const dotRefs = useRef([])
  const ringRef = useRef(null)

  useEffect(() => {
    if (!sceneRef.current) return

    const width = sceneRef.current.clientWidth
    const height = sceneRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputEncoding = THREE.sRGBEncoding
    sceneRef.current.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const keyL = new THREE.DirectionalLight(0xffffff, 1.7)
    keyL.position.set(4, 5, 6)
    scene.add(keyL)
    const fillL = new THREE.DirectionalLight(0x88aaff, 0.7)
    fillL.position.set(-5, 2, 3)
    scene.add(fillL)
    const rimL = new THREE.DirectionalLight(0xffffff, 1.4)
    rimL.position.set(-2, -3, -4)
    scene.add(rimL)
    const accentL = new THREE.PointLight(0xD72E4E, 1.6, 16)
    accentL.position.set(0, 0, 3)
    scene.add(accentL)

    const canGroup = createCan('berry')
    canGroup.scale.setScalar(1.18)
    canGroup.rotation.y = Math.PI
    scene.add(canGroup)

    let mouseX = 0, mouseY = 0
    let targetTilt = 0
    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
      targetTilt = mouseX * 0.12
    }
    window.addEventListener('mousemove', onMove)

    let currentFlavorIdx = 0
    let flavorTl = null
    let tl = null
    if (window.innerWidth >= 768) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1.2,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress
            const completeRotations = Math.PI + progress * 4 * Math.PI * 2
            canGroup.rotation.y = completeRotations

            const easedTilt = targetTilt * Math.sin(Math.PI * progress)
            canGroup.rotation.x = easedTilt + Math.sin(self.progress * 24) * 0.03
            canGroup.position.y = Math.sin(progress * Math.PI * 0.6) * 0.1

            accentL.position.x = Math.cos(progress * Math.PI * 2) * 4
            accentL.position.z = 3 + Math.cos(progress * Math.PI * 2) * 2
            keyL.position.x = Math.sin(progress * Math.PI * 2) * 5

            const stripActive = Math.min(FLAVORS.length - 1, progress * FLAVORS.length)
            const activeIdx = Math.floor(stripActive)

            if (activeIdx !== currentFlavorIdx) {
              currentFlavorIdx = activeIdx
              const fl = FLAVORS[activeIdx]
              setCanFlavor(canGroup, fl.key)
              document.documentElement.style.setProperty('--accent', fl.color)

              if (flavorTl) flavorTl.kill()
              flavorTl = gsap.timeline()
              if (titleRef.current) {
                flavorTl.fromTo(titleRef.current, { yPercent: 80, opacity: 0, filter: 'blur(20px)' },
                  { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' }, 0)
              }
              if (copyRef.current) {
                flavorTl.fromTo(copyRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.15)
              }
              if (subtitleRef.current) {
                flavorTl.fromTo(subtitleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.25)
              }

              updateFlavorUI(activeIdx)
            }
            updateProgressRing(progress)
          }
        }
      })
    }

    function updateProgressRing(progress) {
      if (ringRef.current) ringRef.current.style.background = `conic-gradient(from 0deg, var(--accent) ${progress * 360}deg, transparent 0deg)`
    }

    function updateFlavorUI(idx) {
      const fl = FLAVORS[idx]
      if (titleRef.current) titleRef.current.textContent = fl.name
      if (subtitleRef.current) subtitleRef.current.textContent = fl.subtitle
      if (copyRef.current) copyRef.current.textContent = fl.copy
      if (indexRef.current) indexRef.current.textContent = `0${idx + 1} / 0${FLAVORS.length}`
      if (glowRef.current) glowRef.current.style.background = `radial-gradient(circle, ${fl.glow}, transparent 70%)`
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        if (i === idx) {
          dot.classList.add('active')
          dot.style.background = fl.color
          dot.style.boxShadow = `0 0 16px ${fl.color}`
        } else {
          dot.classList.remove('active')
          dot.style.background = 'rgba(255,255,255,0.15)'
          dot.style.boxShadow = 'none'
        }
      })
    }

    function raf() {
      keyL.position.y = 5 + mouseY * 1.5
      renderer.render(scene, camera)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    const onResize = () => {
      const w = sceneRef.current.clientWidth
      const h = sceneRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      if (tl) {
        tl.scrollTrigger.kill()
        tl.kill()
      }
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section ref={sectionRef} id="flavors" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 liquid-bg" />
      <div ref={glowRef} className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
           style={{ background: 'radial-gradient(circle, rgba(232,41,53,0.4), transparent 70%)' }} />

      <div className="relative z-10 grid h-full grid-cols-12 grid-rows-12 px-6 md:px-10">
        {/* Top label */}
        <div className="col-span-12 row-span-2 flex items-end justify-between border-b border-white/5 pb-5">
          <span className="label-mono text-white/50">05 / Flavor experience</span>
          <span ref={indexRef} className="label-mono text-white/40">01 / 04</span>
        </div>

{/* Left: Title block */}
<div className="col-span-12 md:col-span-4 row-span-8 flex flex-col justify-center pl-4">
<h2 className="h-display text-4xl md:text-6xl">
Spin <span className="italic font-light text-white/60">the</span> can.
</h2>
<p className="mt-4 text-sm text-white/55 max-w-xs">
Each rotation reveals the next flavor. Same body, different soul — exactly as a single can would change mood.
</p>
</div>

        {/* Center: 3D canvas */}
        <div className="col-span-12 md:col-span-4 row-span-8 relative">
          <div ref={sceneRef} className="absolute inset-0" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center">
            <div ref={ringRef} className="absolute h-[420px] w-[420px] rounded-full opacity-20"
                 style={{ background: 'conic-gradient(from 0deg, var(--accent) 0deg, transparent 0deg)', mask: 'radial-gradient(circle, transparent 58%, black 60%, black 62%, transparent 64%)', WebkitMask: 'radial-gradient(circle, transparent 58%, black 60%, black 62%, transparent 64%)' }} />
          </div>
        </div>

        {/* Right: Flavor card */}
        <div className="col-span-12 md:col-span-4 row-span-8 flex flex-col justify-center gap-6">
          <div>
            <div className="label-mono text-white/40 mb-3">Flavor</div>
            <h3 ref={titleRef} className="h-display border-l-2 pl-4 text-5xl md:text-7xl leading-none"
                style={{ borderColor: 'var(--accent)' }}>
              Berry
            </h3>
            <p ref={subtitleRef} className="mt-3 pl-4 text-xs uppercase tracking-[0.3em] text-white/45">
              Acai · Blueberry · Pomegranate
            </p>
            <p ref={copyRef} className="mt-6 pl-4 max-w-xs text-sm font-light leading-relaxed text-white/60">
              A brooding dark wave. Bold enough for the bold, gentle enough to draw you back.
            </p>
          </div>

          <div className="flex items-center gap-3 pl-4">
            {FLAVORS.map((f, i) => (
              <button
                key={f.key}
                ref={(el) => (dotRefs.current[i] = el)}
                className="h-3 w-3 rounded-full transition-all duration-300"
                style={{ background: i === 0 ? f.color : 'rgba(255,255,255,0.15)', boxShadow: i === 0 ? `0 0 16px ${f.color}` : 'none' }}
                aria-label={f.name}
              />
            ))}
          </div>

          <div className="pl-4">
            <span className="label-mono text-white/30 italic">Spin the can to explore</span>
          </div>
        </div>

        <div className="col-span-12 row-span-2 flex items-center justify-center border-t border-white/5 pt-4">
          <span className="label-mono text-white/40">Scroll to spin · backward reverses</span>
        </div>
      </div>
    </section>
  )
}
