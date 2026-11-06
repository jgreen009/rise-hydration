import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Hide preloader once React has rendered (with a safe fallback timer).
function hidePreloader() {
  const pre = document.getElementById('preloader')
  if (pre) {
    pre.classList.add('hidden')
    setTimeout(() => { if (pre && pre.parentNode) pre.parentNode.removeChild(pre) }, 1000)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)

requestAnimationFrame(hidePreloader)
setTimeout(hidePreloader, 2500)
