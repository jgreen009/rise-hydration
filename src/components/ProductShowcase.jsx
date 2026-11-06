import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const VARIANTS = [
  {
    key: 'berry',
    name: 'Berry',
    sub: 'Acai · Blueberry · Pomegranate',
    desc: 'A deep, brooding wave of forest berries layered with the tart clarity of pomegranate — a dark, moisturizing pour.',
    color: '#990F4B',
    tag: 'Bestseller',
    img: '/assets/cans/can-berry.svg'
  },
  {
    key: 'lime',
    name: 'Lime Citrus',
    sub: 'Citrus · Mint · Sea Salt',
    desc: 'A crisp pulse of hand-pressed citrus balanced by cool mint and trace sea salt — refreshment with altitude.',
    color: '#32CD32',
    tag: 'New',
    img: '/assets/cans/can-lime.svg'
  },
  {
    key: 'mango',
    name: 'Mango Citrus',
    sub: 'Citrus · Passion · Turmeric',
    desc: 'Sun-ripened mango meets tropical passion and golden turmeric — warm, radiant, and quietly electric.',
    color: '#F4BB44',
    tag: 'Limited',
    img: '/assets/cans/can-mango.svg'
  },
  {
    key: 'blue',
    name: 'Blue Raspberry',
    sub: 'Wild Berry · Electric Charge',
    desc: 'A high-voltage flash of wild raspberry with an electric finish — bold, bright, and unmistakably unusual.',
    color: '#0000FF',
    tag: 'Edge',
    img: '/assets/cans/can-blue.svg'
  }
]

export default function ProductShowcase() {
  const sectionRef = useRef(null)
  const stripeRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { yPercent: 30, opacity: 0.1 }, {
        yPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', end: 'bottom 55%', scrub: 1 }
      })

      gsap.utils.toArray('.variant-card').forEach((card, i) => {
        const img = card.querySelector('.variant-img')
        const meta = card.querySelector('.variant-meta')
        gsap.fromTo(card, { y: 80, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 82%' }
        })
        gsap.fromTo(img, { yPercent: -12, scale: 0.9 }, {
          yPercent: 0, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 90%', end: 'bottom top', scrub: 1 }
        })
        gsap.fromTo(img, { y: 0 }, {
          y: -80, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
        })
      })

      gsap.to(stripeRef.current, {
        xPercent: -50, ease: 'none',
        scrollTrigger: { trigger: stripeRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="story" className="relative py-12 md:py-24 lg:py-44 overflow-hidden">
      <div className="absolute inset-0 liquid-bg opacity-70" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-mono text-white/50">02 / The collection</span>
            <h2 ref={headingRef} className="h-display mt-4 text-5xl md:text-7xl">
              Four ways to <span className="italic font-light text-white/60">rise.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/60 leading-relaxed">
            Each RISE variant shares one engineered formula — only the fruit changes. Same electrolyte
            balance, same zero sugar, fully different experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VARIANTS.map((v) => (
            <article
              key={v.key}
              className="variant-card group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 pb-8 backdrop-blur-md transition-all duration-500 hover:border-white/20"
              data-cursor="hover"
              style={{ '--accent': v.color }}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl transition-all duration-700 group-hover:scale-125"
                   style={{ background: `radial-gradient(circle, ${v.color}40, transparent 70%)` }} />
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md"
                      style={{ background: `${v.color}25`, border: `1px solid ${v.color}50`, color: v.color }}>
                  {v.tag}
                </span>
              </div>

              <div className="relative my-2 flex-1">
                <div className="absolute inset-x-0 -bottom-2 top-6 mx-auto h-[86%] rounded-3xl"
                     style={{ background: `linear-gradient(to top, ${v.color}30, transparent 80%)` }} />
                <img src={v.img} alt={`RISE ${v.name} can`} className="variant-img relative z-10 mx-auto h-72 md:h-80 w-auto transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105" />
              </div>

              <div className="variant-meta relative z-10 mt-4">
                <p className="label-mono mb-2 text-white/40">{v.sub}</p>
                <h3 className="text-2xl font-bold tracking-tight">{v.name}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/60">{v.desc}</p>
                <div className="mt-5 flex items-center justify-center border-t border-white/5 pt-4">
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    {v.sub}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative mt-24 overflow-hidden border-y border-white/5 bg-white/[0.015] py-6">
        <div ref={stripeRef} className="marquee flex w-max gap-10 whitespace-nowrap text-2xl md:text-4xl font-black tracking-tight text-white/15">
          {Array.from({ length: 2 }).map((_, i) => (
            <React.Fragment key={i}>
              {['HYDRATE BOLD', '—', '6 ELECTROLYTES', '—', 'ZERO SUGAR', '—', 'PLANT POWERED', '—', 'RISE ABOVE', '—'].map((t, j) => (
                <span key={`${i}-${j}`} className="px-3">{t}</span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
