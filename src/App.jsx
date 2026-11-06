import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import CustomCursor from './components/CustomCursor.jsx'
import FloatingParticles from './components/FloatingParticles.jsx'
import NavBar from './components/NavBar.jsx'
import Hero from './components/Hero.jsx'
import ProductShowcase from './components/ProductShowcase.jsx'
import CinematicVideo from './components/CinematicVideo.jsx'
import Ingredients from './components/Ingredients.jsx'
import HydrationScience from './components/HydrationScience.jsx'
import FlavorExperience from './components/FlavorExperience.jsx'
import FinalCTA from './components/FinalCTA.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tickerFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    const onMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      document.documentElement.style.setProperty('--mx', x.toFixed(3))
      document.documentElement.style.setProperty('--my', y.toFixed(3))
    }
    window.addEventListener('mousemove', onMouse)
    return () => window.removeEventListener('mousemove', onMouse)
  }, [])

  return (
    <div className="relative w-full overflow-x-hidden">
      <CustomCursor />
      <FloatingParticles />
      <NavBar />
      <main>
        <Hero />
        <ProductShowcase />
        <CinematicVideo />
        <Ingredients />
        <HydrationScience />
        <FlavorExperience />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}