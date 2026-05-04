import { useState } from 'react'
import { formatCOP } from '../../utils/formatters'
import { Trash2, CheckCircle, ChevronRight, MessageCircle } from 'lucide-react'
import Modal from '../ui/Modal'
import CheckoutModal from './CheckoutModal'

export default function Cart({ items, onRemove, onConfirm, isStaffMode = false }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const total = items.reduce((s, i) => s + i.subtotal, 0)

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', opacity: 0.3 }}>🛒</div>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Tu carrito está vacío</p>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', opacity: 0.6 }}>Agrega platos desde el menú</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Items */}
      {items.map((item) => (
        <div
          key={item.cartId}
          className="glass animate-slide-up"
          style={{ borderRadius: '16px', padding: '0.9rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <span style={{ fontSize: '1.6rem' }}>{item.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.nombre}
            </p>
            {item.cantidad > 1 && (
              <p style={{ margin: 0, color: 'var(--color-muted)', fontSize: '0.73rem' }}>
                {item.cantidad} {item.tipo === 'wok' ? 'porciones' : 'und.'}
              </p>
            )}
          </div>
          <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap', fontSize: '0.95rem' }}>
            {formatCOP(item.subtotal)}
          </span>
          <button onClick={() => onRemove(item.cartId)} className="btn-danger" style={{ padding: '0.35rem 0.35rem', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-muted)', fontSize: '0.88rem' }}>Total ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-accent)' }}>
          {formatCOP(total)}
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => setShowCheckout(true)}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.85rem', borderRadius: '16px' }}
      >
        <MessageCircle size={18} /> Continuar Pedido
      </button>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} title="Finalizar Pedido" size="md">
        <CheckoutModal 
          items={items} 
          onClose={() => setShowCheckout(false)} 
          onSent={onConfirm} 
          isStaffMode={isStaffMode}
        />
      </Modal>
    </div>
  )
}
