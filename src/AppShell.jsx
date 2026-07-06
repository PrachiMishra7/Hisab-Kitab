import React from 'react'
import Sidebar from './Sidebar'
import { UserCircle } from 'lucide-react'

import { t } from './translations'

// Accept route and setRoute as props
export default function AppShell({ children, route, setRoute, lang = 'en-IN' }) {
  // Title mapping for the top bar
  const routeTitles = {
    home: 'Dashboard',
    transactions: 'Transactions',
    schemes: 'Schemes',
    savings: 'Savings',
    kyc: 'KYC',
    education: 'Education Hub',
    help: 'Help & Support',
    profile: 'Profile'
  };

  return (
    <div className="app-layout">
      {/* 1. SIDEBAR NAVIGATION */}
      <Sidebar route={route} setRoute={setRoute} lang={lang} />

      {/* 2. MAIN CONTENT AREA */}
      <div className="main-content-wrapper">
        <header className="dashboard-header">
          <h1 className="dashboard-title">{t(routeTitles[route] || 'Dashboard', lang)}</h1>
          <div className="header-actions">
            <div className="user-profile-sm">
              <span className="user-avatar-sm" style={{display: 'flex', alignItems: 'center'}}><UserCircle size={20} color="var(--text-secondary)" /></span>
              <span className="user-name-sm">Arunima</span>
            </div>
          </div>
        </header>
        
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  )
}