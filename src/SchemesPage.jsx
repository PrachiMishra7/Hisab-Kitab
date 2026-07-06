import React from 'react'
import { t } from './translations'

export default function SchemesPage({ lang = 'en-IN' }) {
  const schemes = [
    {
      id: 'myscheme',
      title: 'myScheme Portal',
      desc: 'National one‑stop platform to discover and apply for government schemes.',
      link: 'https://www.myscheme.gov.in'
    },
    {
      id: 'pmmvy',
      title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
      desc: 'Cash incentive scheme for pregnant and lactating women.',
      link: 'https://pmmvy.gov.in'
    },
    {
      id: 'standup',
      title: 'Stand Up India',
      desc: 'Loans for women entrepreneurs to start new ventures.',
      link: 'https://www.standupmitra.in'
    },
    {
      id: 'ssy',
      title: 'Sukanya Samriddhi Yojana',
      desc: 'Savings scheme for girl children (via banks/post offices).',
      link: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx'
    },
    {
      id: 'ujjawala',
      title: 'Ujjawala Scheme',
      desc: 'Rescue, rehabilitation, and reintegration of trafficked women.',
      link: 'https://wcd.nic.in/schemes/ujjawala-scheme'
    },
    {
      id: 'hostel',
      title: 'Working Women Hostel',
      desc: 'Safe and affordable accommodation for working women.',
      link: 'https://wcd.nic.in/schemes/working-women-hostel'
    },
    {
      id: 'osc',
      title: 'One Stop Centre Scheme',
      desc: 'Support services for women facing violence.',
      link: 'https://wcd.nic.in/schemes/one-stop-centre-scheme'
    }
  ]

  function open(url) {
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) alert('Popup blocked. Please allow popups for this site.')
  }

  return (
    <div className="card">
      <h2 className="card-title">{t('Schemes', lang)}</h2>
      <div style={{ display:'grid', gap:12 }}>
        {schemes.map(s => (
          <div
            key={s.id}
            style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              padding:16,
              borderRadius:12,
              background:'var(--glass-bg)',
              border:'1px solid var(--glass-border)',
              boxShadow:'0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div style={{ fontWeight:700 }}>{s.title}</div>
              <div style={{ color:'var(--text-secondary)', fontSize:13, marginTop: 4 }}>{s.desc}</div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button className="secondary-btn" onClick={() => open(s.link)}>Details</button>
              <button className="primary-btn" onClick={() => open(s.link)}>{t('ApplyNow', lang)}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
