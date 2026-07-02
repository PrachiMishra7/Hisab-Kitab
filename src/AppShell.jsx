import React from 'react'
import RibbonNav from './Ribbonnav' // 👈 Import the new component

// Accept route and setRoute as props
export default function AppShell({ children, route, setRoute }) {
  return (
    <div className="app-shell">
      
      {/* 1. DARK GRADIENT HEADER */}
      <header className="app-bar">
        <div className="brand">
          <img
            src="logo12345.jpg"
            alt="Finsakhi logo"
            className="brand-logo"
            // FIX: Removed conflicting HTML width/height to rely on CSS (70x70)
            onError={(e) => {
              e.currentTarget.onerror = null
              // Fallback SVG (also fixed to a smaller size)
              e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70"><rect width="100%" height="100%" fill="%23072036"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23ffd4a3">Logo</text></svg>';
              e.currentTarget.style.width = '70px';
              e.currentTarget.style.height = '70px';
              e.currentTarget.style.objectFit = 'contain';
            }}
          />
          <div className="brand-info">
            <div className="brand-text">FINSAKHI</div>
            <div className="subtitle">Finance in Her Voice. Power in Her Hands.</div>
          </div>
        </div>
      </header>

      {/* 2. RIBBON NAVIGATION (Correctly positioned below the header) */}
      <RibbonNav route={route} setRoute={setRoute} />

      {/* 3. MAIN CONTENT AREA */}
      <main className="app-main">{children}</main>

      <footer className="app-footer">
        No audio leaves the device unless you confirm. Prototype uses browser speech APIs.
      </footer>
    </div>
  )
}