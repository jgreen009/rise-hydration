import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ELECTROLYTES = [
  { symbol: 'K', name: 'Potassium', value: '320mg', color: '#ff9050' },
  { symbol: 'Na', name: 'Sodium', value: '210mg', color: '#80d4ff' },
  { symbol: 'Mg', name: 'Magnesium', value: '60mg', color: '#80ffa0' },
  { symbol: 'Ca', name: 'Calcium', value: '45mg', color: '#c080ff' },
  { symbol: 'Cl', name: 'Chloride', value: '180mg', color: '#80ffd0' },
  { symbol: 'Zn', name: 'Zinc', value: '8mg', color: '#ff80a0' }
]

export default function HydrationScience() {
  const sectionRef = useRef(null)
  const diagramRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sci-title', { yPercent: 30, opacity: 0 }, {
        yPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.sci-title', start: 'top 80%' }
      })

      gsap.fromTo('.sci-cell', { scale: 0.6, opacity: 0.2 }, {
        scale: 1, opacity: 1, ease: 'expo.out', stagger: 0.12, duration: 1,
        scrollTrigger: { trigger: diagramRef.current, start: 'top 70%' }
      })

      gsap.utils.toArray('.electrolyte-orb').forEach((orb, i) => {
        gsap.fromTo(orb, { y: 30, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.7, delay: 0.1 * i, ease: 'power2.out',
          scrollTrigger: { trigger: orb, start: 'top 90%' }
        })
        gsap.to(orb, {
          y: -16, ease: 'sine.inOut', repeat: -1, yoyo: true, duration: 2 + (i % 3),
          delay: 0.5 + 0.1 * i
        })
      })

      const pulseTl = gsap.timeline({ repeat: -1, yoyo: true })
      pulseTl.fromTo('.cell-pulse', { scale: 1, opacity: 0.5 }, { scale: 1.15, opacity: 0.1, duration: 2.5, ease: 'sine.inOut' })

      gsap.fromTo('.sci-stat', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.sci-stats', start: 'top 85%' }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="science" className="relative overflow-hidden py-12 md:py-24 lg:py-44">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020610] via-[#050d18] to-[#020610]" />
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,180,255,0.2),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-mono text-white/50">04 / Hydration science</span>
            <h2 className="sci-title h-display mt-4 text-5xl md:text-7xl">
              At the <span className="italic font-light text-white/60">cellular</span> level.
            </h2>
          </div>
          <p className="max-w-md text-sm text-white/60 leading-relaxed">
            RISE replicates the body's natural electrolyte balance in osmotic harmony with your cells.
            Faster absorption. Sustained release. No sugar spike.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div ref={diagramRef} className="relative aspect-square w-full max-w-lg">
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />

            <div className="sci-cell absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,180,255,0.18),rgba(40,100,180,0.08)_60%,transparent)] backdrop-blur-sm" />
            <div className="cell-pulse sci-cell absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,220,255,0.3),transparent_70%)]" />
            <div className="sci-cell absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-md">
              <div className="grid h-full w-full place-items-center">
                <span className="text-xs font-bold tracking-widest text-[#020610]">RISE</span>
              </div>
            </div>

            {ELECTROLYTES.map((el, i) => {
              const angle = (i / ELECTROLYTES.length) * Math.PI * 2 - Math.PI / 2
              const r = 180
              const x = Math.cos(angle) * r
              const y = Math.sin(angle) * r
              return (
                <div
                  key={el.symbol}
                  className="electrolyte-orb absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
                  style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                >
                  <div className="relative">
                    <div className="grid h-14 w-14 place-items-center rounded-full backdrop-blur-md"
                         style={{ background: `${el.color}25`, border: `1.5px solid ${el.color}80` }}>
                      <span className="text-sm font-bold" style={{ color: el.color }}>{el.symbol}</span>
                    </div>
                    <div className="absolute -inset-1 rounded-full opacity-40 blur-md" style={{ background: el.color }} />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs uppercase tracking-widest text-white/40">{el.name}</div>
                    <div className="text-base font-semibold" style={{ color: el.color }}>{el.value}</div>
                  </div>
                  <svg className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-40" width="20" height="2">
                    <line x1="0" y1="1" x2="20" y2="1" stroke={el.color} strokeWidth="1.5" strokeDasharray="3 2" />
                  </svg>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
              When electrolytes match your body's natural osmotic pressure, water doesn't sit in your stomach —
              it <span className="font-semibold text-white">passes through</span> cellular walls at the rate the
              body was designed to absorb it.
            </p>
            <p className="mt-6 text-sm font-light leading-relaxed text-white/55">
              The result is hydration that you feel in minutes, not hours — supporting cognition, recovery,
              and endurance with no peaks or crashes.
            </p>

            <div className="sci-stats mt-12 grid gap-6 sm:grid-cols-3">
              {[
                ['1.5×', 'Absorption rate'],
                ['4hr', 'Sustained hydration'],
                ['0mg', 'Added sugar']
              ].map(([val, lbl]) => (
                <div key={lbl} className="sci-stat">
                  <div className="text-3xl md:text-4xl font-bold tracking-tight"
                       style={{ color: 'var(--accent)' }}>{val}</div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-white/45">{lbl}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-2">
              {['ISO 22000', 'Osmolarity Matched', 'Vegan', 'Non-GMO', 'GMP Certified'].map((b) => (
                <span key={b} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
