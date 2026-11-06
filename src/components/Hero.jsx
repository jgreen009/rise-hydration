import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CanScene } from '../three/CanScene.js'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sceneRef = useRef(null)
  const titleRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    if (!sceneRef.current) return

    if (window.innerWidth < 768) {
      // Remove overflow clipping on mobile — no GSAP animation to un-hide chars
      titleRef.current?.querySelectorAll(':scope > span').forEach((el) => {
        el.style.overflow = 'visible'
      })
      return
    }

    const scene = new CanScene(sceneRef.current)

    const chars = Array.from(titleRef.current?.querySelectorAll('.split-char') || [])
    gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0, rotateX: -90 },
      {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.04,
        delay: 0.4,
        onComplete: () => {
          titleRef.current?.querySelectorAll(':scope > span').forEach((el) => {
            el.style.overflow = 'visible'
          })
        }
      }
    )

    gsap.fromTo(
      '.hero-line',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 1, ease: 'power3.out', delay: 1.6 }
    )
    gsap.fromTo(
      '.hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1.7 }
    )
    gsap.fromTo(
      '.hero-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 1.85, stagger: 0.1 }
    )

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 1.2,
        onUpdate: (self) => {
          scene.setRotation(self.progress * Math.PI * 0.9)
        }
      }
    })

    if (window.innerWidth > 768) {
      scrollTl.to(sceneRef.current, { scale: 1.4, ease: 'power2.inOut' }, 0)
    }

    return () => {
      scrollTl.scrollTrigger.kill()
      scrollTl.kill()
      scene.dispose()
    }
  }, [])

  const splitText = (text) =>
    text.split('').map((ch, i) => (
      <span key={i} className="split-char" style={{ display: 'inline-block' }}>
        {ch}
     </span>
    ))

  return (
    <section ref={sectionRef} id="top" className="relative h-screen w-full overflow-hidden pt-24 md:pt-28">
      <div className="absolute inset-0 liquid-bg" />
      <div className="absolute inset-0 noise" />

      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-12 items-center px-6 md:px-10">
        <div className="col-span-12 md:col-span-6 z-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="label-mono text-white/50">01 / Hydration reimagined</span>
            <div className="hero-line h-px w-16 origin-left bg-gradient-to-r from-white/60 to-transparent" />
         </div>
          <h1 ref={titleRef} className="h-display text-[clamp(2.8rem,12vw,5rem)] md:text-[clamp(4rem,10vw,12rem)] leading-[0.68] tracking-[-0.05em]">
            <span className="block overflow-hidden">{splitText('Rise')}</span>
            <span className="block overflow-hidden bg-gradient-to-r from-white via-white to-[color-mix(in_srgb,var(--accent)_85%,white)] bg-clip-text text-transparent">
              {splitText('Above')}
           </span>
            <span className="block overflow-hidden italic font-light text-white/60">
              {splitText('thirst.')}
           </span>
         </h1>
<p className="hero-sub mt-4 max-w-md text-sm md:text-lg font-light leading-relaxed text-white/70">
            RISE is a premium hydration experience engineered with plant-based electrolytes,
            real fruit adaptogens, and zero sugar — designed to make you feel limitless.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#flavors" className="btn-primary hero-cta" data-cursor="hover">
              Explore the range
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14m-7-7l7 7-7 7" />
             </svg>
           </a>
            <a href="#science" className="btn-ghost hero-cta" data-cursor="hover">
              See the science
           </a>
         </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              ['#6', 'Electrolytes'],
              ['0g', 'Sugar'],
              ['100%', 'Natural']
            ].map(([num, lbl]) => (
              <div key={lbl}>
                <div className="text-xl md:text-3xl font-bold">{num}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/45 mt-1">{lbl}</div>
             </div>
            ))}
         </div>
       </div>

        <div className="col-span-12 md:col-span-6 relative h-full flex items-center justify-center">
          <div className="absolute left-1/2 bottom-0 -z-10 h-[35vh] w-[60vw] max-w-[300px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,180,255,0.2),transparent_70%)] blur-2xl md:left-1/2 md:top-1/2 md:-translate-y-1/2 md:h-[60%] md:w-[60%] md:max-w-none" />
          <div
            ref={sceneRef}
            className="hero-can-layer relative bottom-0 h-[45vh] w-full max-w-[280px] md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:h-[76vh] md:max-w-[460px]"
          />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <span className="label-mono text-white/40">Scroll to immerse</span>
            <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
         </div>
       </div>
     </div>
   </section>
  )
}
