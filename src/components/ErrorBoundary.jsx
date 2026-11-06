import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('RISE runtime error:', error, info)
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      const pre = document.getElementById('preloader')
      if (pre) pre.style.display = 'none'
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#020610', color: '#fff', padding: '2rem', textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif', zIndex: 99999
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px' }}>RISE</div>
          <p style={{ marginTop: 16, opacity: 0.6, maxWidth: 380, fontSize: 14, lineHeight: 1.6 }}>
            Something went off-script. Reload to launch the experience again.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              marginTop: 24, padding: '12px 28px', borderRadius: 999,
              background: 'var(--accent, #990F4B)', color: '#fff',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13,
              letterSpacing: '0.5px'
            }}
          >
            Reload experience
          </button>
          <pre style={{
            marginTop: 28, fontSize: 11, color: 'rgba(255,255,255,0.3)',
            maxWidth: 600, overflow: 'auto', whiteSpace: 'pre-wrap',
            background: 'rgba(255,255,255,0.04)', padding: 14, borderRadius: 10
          }}>
            {this.state.error?.message || String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
