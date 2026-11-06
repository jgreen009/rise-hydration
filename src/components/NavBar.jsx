import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => setShowModal(false), 2000)
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2 backdrop-blur-xl bg-black/40 border-b border-white/5' : 'py-3 md:py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-3">
            <a href="#top" className="flex items-center gap-2 group">
              <div className="relative h-6 w-6 md:h-8 md:w-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/5 blur-md group-hover:from-white/60 transition-all" />
                <div className="absolute inset-1 rounded-full border border-white/40" />
                <div className="absolute inset-2 rounded-full bg-white" />
              </div>
              <span className="text-sm md:text-lg font-black tracking-tight">RISE</span>
            </a>
          </div>

          <div className="hidden md:flex items-center gap-9 text-sm">
            {['Flavors', 'Science', 'Ingredients', 'Story'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-white/70 hover:text-white transition-colors duration-300 group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 right-0 h-px scale-x-0 origin-left bg-current transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-xs hidden md:inline-flex"
            >
              Join waitlist
            </button>
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={`block h-px w-6 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px w-6 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="px-6 py-6 flex flex-col gap-4 backdrop-blur-xl bg-black/60">
                {['Flavors', 'Science', 'Ingredients', 'Story'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)} className="text-base text-white/80">
                    {item}
                  </a>
                ))}
                <button
                  onClick={() => { setShowModal(true); setOpen(false) }}
                  className="text-base text-[var(--accent)] font-semibold mt-2"
                >
                  Join the waitlist →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#020610] p-8 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-5 top-5 text-white/30 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2 mb-6">
                <div className="relative h-6 w-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/5 blur-sm" />
                  <div className="absolute inset-0.5 rounded-full border border-white/40" />
                  <div className="absolute inset-1 rounded-full bg-white" />
                </div>
                <span className="text-sm font-black tracking-tight">RISE</span>
              </div>

              {!submitted ? (
                <>
                  <h3 className="h-display text-2xl md:text-3xl">Rise above <span className="italic font-light text-white/60">the</span> wait.</h3>
                  <p className="mt-3 text-sm font-light text-white/60 leading-relaxed">
                    Be the first to know when RISE launches. Early access, exclusive drops, and altitude.
                  </p>
                  <form onSubmit={onSubmit} className="mt-6">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@altitude.com"
                        className="w-full rounded-full bg-white/5 py-3.5 pl-5 pr-32 text-sm outline-none transition-colors focus:border-[var(--accent)] border border-white/10"
                        required
                      />
                      <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 text-xs">
                        Join
                      </button>
                    </div>
                  </form>
                  <p className="mt-4 text-[11px] text-white/30 text-center tracking-wider uppercase">
                    No spam. Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="text-3xl mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="mx-auto">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <path d="M22 4L12 14.01l-3-3" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold">You're on the list.</h4>
                  <p className="mt-2 text-sm text-white/60">Welcome to the rise. Check your inbox.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
