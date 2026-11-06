import React from 'react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#020610] py-12 md:py-24 lg:py-44">
      <div className="absolute inset-0 z-0 opacity-30 liquid-bg" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-white/5 blur-md" />
                <div className="absolute inset-1 rounded-full border border-white/40" />
                <div className="absolute inset-2 rounded-full bg-white" />
              </div>
              <span className="text-xl font-black tracking-tight">RISE</span>
            </div>
            <p className="mt-6 max-w-sm text-sm font-light leading-relaxed text-white/60">
              Premium hydration, engineered with plant-based electrolytes. Designed in California, brewed
              with real fruit. No sugar, no preservatives, no compromise.
            </p>

            <div className="mt-8 flex items-center gap-2 text-white/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="label-mono text-white/30">Premium hydration · Zero sugar · Plant based</span>
            </div>
          </div>

          <div className="md:col-span-1" />
          <div className="md:col-span-2">
            <div className="label-mono mb-4 text-white/40">Product</div>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {['Flavors', 'Ingredients', 'Science', 'Story'].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="transition-colors hover:text-[var(--accent)]">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="label-mono mb-4 text-white/40">Company</div>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {['Our story', 'Journal', 'Careers', 'Press'].map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-[var(--accent)]">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="label-mono mb-4 text-white/40">Connect</div>
            <ul className="flex flex-col gap-3 text-sm text-white/70">
              {['Instagram', 'TikTok', 'YouTube', 'Newsletter'].map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-[var(--accent)]">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/5 pt-8 text-xs text-white/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} RISE Hydration Inc. All rights reserved.</span>
          <div className="flex flex-wrap gap-5">
            {['Privacy', 'Terms', 'Accessibility', 'Wholesale'].map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-white">{l}</a>
            ))}
          </div>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Brewed at altitude
          </span>
        </div>
      </div>
    </footer>
  )
}
