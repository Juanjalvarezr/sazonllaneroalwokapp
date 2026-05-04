import { useState } from 'react'
import { Delete, Lock } from 'lucide-react'

export default function PinPad({ onSuccess, onCancel, title = 'Ingresa tu PIN' }) {
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)

  const handleKey = (key) => {
    if (pin.length < 6) setPin(p => p + key)
  }

  const handleDelete = () => setPin(p => p.slice(0, -1))

  const handleSubmit = () => {
    const result = onSuccess(pin)
    if (!result) {
      setShake(true)
      setPin('')
      setTimeout(() => setShake(false), 500)
    }
  }

  const keys = ['1','2','3','4','5','6','7','8','9','0']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(234,88,12,0.15)',
        border: '1px solid rgba(234,88,12,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Lock size={28} color="var(--color-accent)" />
      </div>

      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', textAlign: 'center' }}>{title}</p>

      {/* PIN dots */}
      <div
        style={{
          display: 'flex', gap: '0.75rem',
          animation: shake ? 'shakeX 0.4s ease' : 'none',
        }}
      >
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: '50%',
            background: pin.length > i ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
            border: '2px solid',
            borderColor: pin.length > i ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.15s',
            transform: pin.length > i ? 'scale(1.2)' : 'scale(1)',
          }} />
        ))}
      </div>

      {/* Keypad */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', width: '100%', maxWidth: 280,
      }}>
        {['1','2','3','4','5','6','7','8','9'].map(k => (
          <button key={k} onClick={() => handleKey(k)} style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: 'var(--color-text)',
            fontSize: '1.4rem',
            fontWeight: 600,
            padding: '1rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'Outfit, sans-serif',
          }}
          onMouseOver={e => e.target.style.background = 'rgba(234,88,12,0.15)'}
          onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
          >{k}</button>
        ))}
        <button onClick={handleDelete} style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: '16px', color: '#f87171', fontSize: '1rem',
          padding: '1rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Delete size={20} />
        </button>
        <button onClick={() => handleKey('0')} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          color: 'var(--color-text)',
          fontSize: '1.4rem',
          fontWeight: 600,
          padding: '1rem',
          cursor: 'pointer',
          transition: 'all 0.15s',
          fontFamily: 'Outfit, sans-serif',
        }}
        onMouseOver={e => e.target.style.background = 'rgba(234,88,12,0.15)'}
        onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
        >0</button>
        <button onClick={handleSubmit} disabled={pin.length < 4} style={{
          background: pin.length >= 4 ? 'linear-gradient(135deg,#ea580c,#c2410c)' : 'rgba(255,255,255,0.04)',
          border: 'none', borderRadius: '16px', color: 'white',
          fontSize: '0.85rem', fontWeight: 700, padding: '1rem', cursor: pin.length >= 4 ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', letterSpacing: '0.05em',
        }}>OK</button>
      </div>

      {onCancel && (
        <button className="btn-secondary" onClick={onCancel} style={{ marginTop: '-0.5rem' }}>
          Cancelar
        </button>
      )}

      <style>{`
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-8px); }
          40%,80%  { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}
