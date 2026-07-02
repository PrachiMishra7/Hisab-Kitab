import React from 'react';
import { Home, CreditCard, ClipboardList, PiggyBank, ShieldCheck, GraduationCap, HelpCircle, User } from 'lucide-react';

export default function Sidebar({ route, setRoute }) {
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard size={18} /> },
    { id: 'schemes', label: 'Schemes', icon: <ClipboardList size={18} /> },
    { id: 'savings', label: 'Savings', icon: <PiggyBank size={18} /> },
    { id: 'kyc', label: 'KYC', icon: <ShieldCheck size={18} /> },
    { id: 'education', label: 'Education Hub', icon: <GraduationCap size={18} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> },
    { id: 'profile', label: 'Profile', icon: <User size={18} /> }
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
        Finance in Her Voice.<br/>Power in Her Hands.
      </div>
    </aside>
  );
}
