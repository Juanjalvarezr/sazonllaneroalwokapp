import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { User, MessageCircle, CreditCard, Wallet, Banknote, FileText, Send, X, CheckCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '573046668936'

const PAYMENT_METHODS = [
  { key: 'nequi',      label: 'Nequi',      icon: '💜', color: '#9333ea' },
  { key: 'daviplata',  label: 'Daviplata',  icon: '🔴', color: '#dc2626' },
  { key: 'efectivo',   label: 'Efectivo',   icon: '💵', color: '#16a34a' },
]

function buildWhatsAppMessage({ nombre, items, total, pago, nota }) {
  const itemLines = items
    .map(i => `  • ${i.nombre}: ${formatCOP(i.subtotal)}`)
    .join('\n')

  const pagoLabel = PAYMENT_METHODS.find(p => p.key === pago)?.label || pago

  let msg = `🔥 *Nuevo Pedido — Sazón Llanero al Wok*\n\n`
  msg += `👤 *Cliente:* ${nombre}\n`
  msg += `📋 *Pedido:*\n${itemLines}\n`
  msg += `💰 *Total: ${formatCOP(total)}*\n`
  msg += `💳 *Pago:* ${pagoLabel}\n`
  if (nota) msg += `📝 *Nota:* ${nota}\n`
  msg += `\n⏰ _Pedido anticipado — por favor apartar_ ✅`

  return encodeURIComponent(msg)
}

export default function CheckoutModal({ items, onClose, onSent, isStaffMode = false }) {
  const { dispatch } = useStore()
  const [nombre, setNombre] = useState(isStaffMode ? 'Pedido en Sitio' : '')
  const [pago, setPago] = useState('efectivo')
  const [nota, setNota] = useState('')
  const [sent, setSent] = useState(false)

  const total = items.reduce((s, i) => s + i.subtotal, 0)

  const handleConfirm = () => {
    if (!nombre.trim()) return
    
    if (!isStaffMode) {
      const msg = buildWhatsAppMessage({ nombre: nombre.trim(), items, total, pago, nota })
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    }
    
    // Register order in system
    dispatch({ 
      type: 'PLACE_ORDER', 
      cliente: nombre.trim(), 
      pago, 
      nota,
      status: isStaffMode ? 'en_cocina' : 'pendiente' // Direct to kitchen if staff
    })
    
    setSent(true)
    setTimeout(() => { onSent?.(); onClose() }, 1800)
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#4ade80', margin: '0 0 8px' }}>
          {isStaffMode ? '¡Pedido Registrado!' : '¡Pedido enviado!'}
        </h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>
          {isStaffMode ? 'El pedido ya está en el sistema del restaurante.' : 'Te abrimos WhatsApp para confirmar tu reserva de comida 🔥'}
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Order summary */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', margin: '0 0 8px' }}>
          Resumen
        </p>
        {items.map(i => (
          <div key={i.cartId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', padding: '3px 0', gap: '0.5rem' }}>
            <span style={{ opacity: 0.85 }}>{i.emoji} {i.nombre}</span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Outfit,sans-serif', fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCOP(i.subtotal)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.6rem', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1rem' }}>Total</span>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.1rem', color: 'var(--color-accent)' }}>{formatCOP(total)}</span>
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
          {isStaffMode ? 'Identificador del Pedido' : 'Tu nombre *'}
        </label>
        <div style={{ position: 'relative' }}>
          <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder={isStaffMode ? "Mesa / Cliente" : "¿Cómo te llamamos?"}
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px', color: 'var(--color-text)', padding: '0.65rem 0.9rem 0.65rem 2.2rem',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Método de pago */}
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>
          Método de pago *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          {PAYMENT_METHODS.map(({ key, label, icon, color }) => (
            <button key={key} onClick={() => setPago(key)} style={{
              padding: '0.75rem 0.5rem',
              borderRadius: '14px',
              border: '2px solid',
              borderColor: pago === key ? color : 'rgba(255,255,255,0.1)',
              background: pago === key ? `${color}20` : 'rgba(255,255,255,0.03)',
              color: pago === key ? color : 'var(--color-muted)',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              fontSize: '0.82rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ fontSize: '1.4rem' }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Nota */}
      <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
          Nota adicional (opcional)
        </label>
        <textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Ej: Sin picante, punto de la carne..."
          rows={2}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px', color: 'var(--color-text)', padding: '0.65rem 0.9rem',
            fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box',
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      {/* CTA */}
      <button
        onClick={handleConfirm}
        disabled={!nombre.trim()}
        className="btn-primary"
        style={{
          justifyContent: 'center', fontSize: '1rem', padding: '0.9rem',
          background: isStaffMode 
            ? 'linear-gradient(135deg,#ea580c,#c2410c)'
            : (nombre.trim() ? 'linear-gradient(135deg,#25d366,#128c7e)' : 'rgba(255,255,255,0.06)'),
          boxShadow: (isStaffMode || nombre.trim()) ? '0 0 24px rgba(234,88,12,0.35)' : 'none',
          opacity: !nombre.trim() ? 0.5 : 1,
          cursor: !nombre.trim() ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
      >
        {isStaffMode ? <CheckCircle size={20} /> : <MessageCircle size={20} />}
        {isStaffMode ? 'Registrar Pedido (Caja)' : 'Confirmar por WhatsApp'}
      </button>

      {!isStaffMode && (
        <p style={{ color: 'var(--color-muted)', fontSize: '0.73rem', textAlign: 'center', margin: 0 }}>
          Se abrirá WhatsApp con tu pedido listo para enviar al restaurante 📲
        </p>
      )}
    </div>
  )
}
