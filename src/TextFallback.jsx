import React, { useState } from 'react'
import { t } from './translations'

export default function TextFallback({ onSubmit, templates = [], lang = 'en-IN' }) {
  const [text, setText] = useState('')

  function submit() {
    const t = text.trim()
    if (!t) return
    onSubmit && onSubmit(t)
    setText('')
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('QuickText', lang)}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t('TypeTemplate', lang)}
        />
        <button className="primary-btn" onClick={submit}>{t('SendBtn', lang)}</button>
      </div>

      {templates && templates.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {templates.map((t, i) => (
            <button
              key={i}
              className="sample-pill"
              onClick={() => { onSubmit && onSubmit(t) }}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
