import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const canRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const ctx = gsap.context(() => {
      const chars = titleRef.current ? titleRef.current.querySelectorAll('.cta-char') : []
      if (chars.length) {
        gsap.fromTo(chars, { yPercent: 110, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.03,
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%' }
        })
      }

      if (canRef.current) {
        gsap.fromTo(canRef.current, { y: 80, opacity: 0, scale: 0.85, rotate: -8 }, {
          y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        })
        gsap.fromTo(canRef.current, { y: 0 }, {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        })
        gsap.fromTo(canRef.current, { rotate: 0 }, {
          rotate: 6, ease: 'none', transformOrigin: '50% 60%',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        })
      }

      gsap.fromTo('.cta-eyebrow', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.cta-eyebrow', start: 'top 80%' }
      })
      gsap.fromTo('.cta-cta', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3,
        scrollTrigger: { trigger: '.cta-cta', start: 'top 85%' }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const splitText = (text) =>
    text.split('').map((ch, i) => (
      <span key={i} className="cta-char inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
    ))

  return (
    <section ref={sectionRef} className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-12 md:py-24 lg:py-44">
      <div className="absolute inset-0 z-0 liquid-bg" />
      <div className="absolute left-1/2 top-1/2 -z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,180,255,0.2),transparent_60%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1100px] text-center">
        <span className="cta-eyebrow label-mono text-white/50">06 / The choice</span>
        <h2 ref={titleRef} className="h-display mx-auto mt-6 text-6xl md:text-[8rem] leading-[0.85]">
          <span className="block overflow-hidden">
            {splitText('There is ')}<span className="italic font-light text-white/60">{splitText('only')}</span>
          </span>
          <span className="block overflow-hidden bg-gradient-to-b from-white via-white to-[color-mix(in_srgb,var(--accent)_70%,white)] bg-clip-text text-transparent">
            {splitText('one way up.')}
          </span>
        </h2>

        <p className="cta-cta mt-10 mx-auto max-w-md text-base font-light leading-relaxed text-white/65">
          Choose your flavor. Crack the can. Reach higher — and stay there.
          Six electrolytes, zero sugar, real fruit. Rise above.
        </p>

        <div className="cta-cta mt-14 grid grid-cols-3 gap-4 text-center max-w-md mx-auto">
          {[
            ['6', 'Electrolytes'],
            ['0g', 'Sugar'],
            ['100%', 'Natural']
          ].map(([v, l]) => (
            <div key={l}>
              <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{v}</div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <img ref={canRef} src="/assets/cans/can-berry.svg" alt="RISE can" className="absolute right-4 top-1/2 -z-0 h-[60vh] w-auto opacity-25 md:opacity-35 md:right-12" />
    </section>
  )
}
