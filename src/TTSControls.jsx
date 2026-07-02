import React from 'react';

export default function TTSControls({ rate = 1, onChangeRate = ()=>{}, onRepeat = ()=>{} }) {
  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="card-title" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Speech settings</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <label style={{ color: 'var(--text-secondary)' }}>Rate</label>
        <input
          type="range"
          min="0.6"
          max="1.6"
          step="0.1"
          value={rate}
          onChange={e => onChangeRate(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <div style={{ minWidth: 40, textAlign: 'right', color: 'var(--text-primary)', fontWeight: 600 }}>{rate.toFixed(1)}x</div>
        <button className="primary-btn" onClick={onRepeat} style={{ marginLeft: 8 }}>
          🔁 Repeat
        </button>
      </div>
    </div>
  );
}

