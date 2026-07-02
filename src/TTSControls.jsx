import React from 'react';

export default function TTSControls({ rate = 1, onChangeRate = ()=>{}, onRepeat = ()=>{} }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div className="card-title">Speech settings</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        <label style={{ color: '#9fb3c8' }}>Rate</label>
        <input
          type="range"
          min="0.6"
          max="1.6"
          step="0.1"
          value={rate}
          onChange={e => onChangeRate(Number(e.target.value))}
        />
        <div style={{ minWidth: 40, textAlign: 'right' }}>{rate.toFixed(1)}x</div>
        <button className="icon-btn" onClick={onRepeat} style={{ marginLeft: 8 }}>
          🔁 Repeat
        </button>
      </div>
    </div>
  );
}

