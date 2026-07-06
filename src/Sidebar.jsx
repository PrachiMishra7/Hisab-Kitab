import React from 'react';
import { Home, CreditCard, ClipboardList, PiggyBank, ShieldCheck, GraduationCap, HelpCircle, User } from 'lucide-react';
import { t } from './translations';

export default function Sidebar({ route, setRoute, lang = 'en-IN' }) {
  const navItems = [
    { id: 'home', label: t('Dashboard', lang), icon: <Home size={18} /> },
    { id: 'transactions', label: t('Transactions', lang), icon: <CreditCard size={18} /> },
    { id: 'schemes', label: t('Schemes', lang), icon: <ClipboardList size={18} /> },
    { id: 'savings', label: t('Savings', lang), icon: <PiggyBank size={18} /> },
    { id: 'kyc', label: t('KYC', lang), icon: <ShieldCheck size={18} /> },
    { id: 'education', label: t('Education', lang), icon: <GraduationCap size={18} /> },
    { id: 'help', label: t('Help', lang), icon: <HelpCircle size={18} /> },
    { id: 'profile', label: t('Profile', lang), icon: <User size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src="/assets/logo.png"
          alt="Hisab-Kitab logo"
          className="sidebar-logo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="100%" height="100%" fill="%23111" stroke="%23333" rx="12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="%23ffffff">HK</text></svg>';
          }}
        />
        <div className="sidebar-brand-text">Hisab-Kitab</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${route === item.id ? 'active' : ''}`}
            onClick={() => setRoute(item.id)}
          >
            <span className="sidebar-nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {t('Tagline1', lang)}<br/>{t('Tagline2', lang)}
      </div>
    </aside>
  );
}
