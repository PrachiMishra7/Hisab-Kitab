import React, { useState } from 'react'

export default function TextFallback({ onSubmit, templates = [] }) {
  const [text, setText] = useState('')

  function submit() {
    const t = text.trim()
    if (!t) return
    onSubmit && onSubmit(t)
    setText('')
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Quick text fallback</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or choose a template"
        />
        <button className="primary-btn" onClick={submit}>Send</button>
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
