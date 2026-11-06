import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const INGREDIENTS = [
  { name: 'Coconut Water', note: 'Sometimes known as nature\'s isotonic — bringing natural potassium.', icon: '💧', color: '#80d4ff', dist: -180 },
  { name: 'Pink Himalayan Sea Salt', note: 'Trace minerals that anchor hydration at the cellular level.', icon: '🧂', color: '#ffb0c0', dist: 90 },
  { name: 'Magnesium Glycinate', note: 'The recovery mineral — calms nerves, rebalances electrolytes.', icon: '◈', color: '#ff9060', dist: -120 },
  { name: 'Real Fruit Botanicals', note: 'Cold-extracted and lightly tart — no flavorings, just fruit.', icon: '✦', color: '#80ffa0', dist: 160 },
  { name: 'Pink Dragonfruit', note: 'A natural color source — no FD&C, no compromises.', icon: '❀', color: '#ff6090', dist: -200 },
  { name: 'Reishi & Cordyceps', note: 'Adaptogens that build resilience at altitude.', icon: '◉', color: '#c080ff', dist: 80 }
]

const FLOATING = [
  '/assets/ingredients/droplet.svg',
  '/assets/ingredients/berry.svg',
  '/assets/ingredients/lime-slice.svg',
  '/assets/ingredients/mango.svg',
  '/assets/ingredients/ice.svg',
  '/assets/ingredients/electrolyte.svg',
  '/assets/ingredients/splash.svg'
]

export default function Ingredients() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const ctx = gsap.context(() => {
      const floaters = gsap.utils.toArray('.ing-float')
      floaters.forEach((el, i) => {
        gsap.fromTo(el, { y: i % 2 === 0 ? -40 : 40, x: i % 2 === 0 ? -30 : 30 }, {
          y: i % 2 === 0 ? 40 : -40, x: i % 2 === 0 ? 30 : -30,
          ease: 'sine.inOut', repeat: -1, yoyo: true, duration: 4 + (i % 4)
        })
      })

      gsap.fromTo('.ing-title', { yPercent: 30, opacity: 0 }, {
        yPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.ing-title', start: 'top 80%' }
      })

      gsap.utils.toArray('.ing-row').forEach((row, i) => {
        gsap.fromTo(row, { y: 60, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: row, start: 'top 85%' }
        })
        const icon = row.querySelector('.ing-icon')
        gsap.fromTo(icon, { scale: 0.5, opacity: 0.3 }, {
          scale: 1, opacity: 1, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 80%', end: 'bottom 30%', scrub: 1 }
        })
      })

      gsap.utils.toArray('.ing-image').forEach((img) => {
        gsap.fromTo(img, { yPercent: -12 }, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="ingredients" className="relative overflow-hidden py-12 md:py-24 lg:py-44">
      <div className="absolute inset-0 liquid-bg opacity-60" />

      {/* Floating decorative assets */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {Array.from({ length: 10 }).map((_, i) => (
          <img
            key={i}
            src={FLOATING[i % FLOATING.length]}
            alt=""
            className="ing-float absolute"
            style={{
              left: `${5 + ((i * 9.3) % 95)}%`,
              top: `${10 + ((i * 7.7) % 80)}%`,
              width: `${30 + (i % 4) * 22}px`,
              opacity: 0.18 + (i % 3) * 0.06
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-mono text-white/50">03 / Ingredients & Benefits</span>
            <h2 className="ing-title h-display mt-4 text-5xl md:text-7xl">
              Built from <span className="italic font-light text-white/60">real.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/60 leading-relaxed">
            Six ingredients you can pronounce, zero you can't. No preservatives, no flavorings, no
            compromises. Every can is the same short list — engineered for honest absorption.
          </p>
        </div>

        <div className="grid gap-x-12 gap-y-3 md:grid-cols-2">
          {INGREDIENTS.map((ing, i) => (
            <div
              key={ing.name}
              className="ing-row group relative grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/5 py-7 transition-colors hover:border-white/20"
            >
              <div
                className="ing-image ing-icon relative grid h-14 w-14 place-items-center rounded-2xl text-2xl gradient-border"
                style={{ background: `${ing.color}18`, color: ing.color }}
              >
                {ing.icon}
                <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity group-hover:opacity-100"
                     style={{ background: ing.color }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{ing.name}</h3>
                <p className="mt-1 text-sm font-light text-white/55 leading-relaxed">{ing.note}</p>
              </div>
              <span className="text-xs tabular-nums text-white/30">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
