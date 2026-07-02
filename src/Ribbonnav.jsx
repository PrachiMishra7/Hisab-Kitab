// src/Ribbonnav.jsx
import React from 'react';
export default function RibbonNav({ route, setRoute }) {
  const items = ['home','transactions','schemes','savings','kyc','education','help','profile'];
  const labels = { home:'Home', transactions:'Transactions', schemes:'Schemes', savings:'Savings', kyc:'KYC', education:'Education Hub', help:'Help & Support', profile:'Profile' };
  return (
    <div className="ribbon-nav">
      {items.map(i => <div key={i} className={`ribbon-item ${route===i?'active':''}`} onClick={()=>setRoute(i)}>{labels[i]}</div>)}
    </div>
  );
}
