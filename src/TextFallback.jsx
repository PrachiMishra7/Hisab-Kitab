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
    <div className="text-fallback" style={{ marginTop: 12 }}>
      <div style={{ color: '#9fb3c8', marginBottom: 8 }}>Quick text fallback</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or choose a template"
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            color: '#fff'
          }}
        />
        <button className="icon-btn" onClick={submit}>Send</button>
      </div>

      {templates && templates.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {templates.map((t, i) => (
            <button
              key={i}
              className="sample"
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
