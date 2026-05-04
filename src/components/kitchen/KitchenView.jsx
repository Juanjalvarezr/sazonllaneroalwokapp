import { useStore } from '../../store/StoreContext'
import { formatTimeAgo } from '../../utils/formatters'
import { ChefHat, Clock, Check, AlertCircle, FileText } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function KitchenView() {
  const { state, dispatch } = useStore()
  const { orders } = state
  const lastOrderCount = useRef(orders.length)

  const pendingOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'en_cocina')

  // Notification sound logic
  useEffect(() => {
    if (orders.length > lastOrderCount.current) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
      audio.play().catch(e => console.log('Audio wait for user interaction'))
    }
    lastOrderCount.current = orders.length
  }, [orders.length])

  const handleNextStatus = (orderId, currentStatus) => {
    const next = currentStatus === 'pendiente' ? 'en_cocina' : 'entregado'
    dispatch({ type: 'UPDATE_ORDER_STATUS', orderId, status: next })
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem' }}>
      {/* Kitchen Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '2.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChefHat size={32} color="var(--color-accent)" /> Control de Cocina
          </h1>
          <p style={{ color: 'var(--color-muted)', margin: '4px 0 0' }}>{pendingOrders.length} comandas en preparación</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p style={{ margin: 0, color: '#4ade80', fontSize: '0.75rem', fontWeight: 700 }}>● SISTEMA ACTIVO</p>
          </div>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', opacity: 0.3 }}>
          <ChefHat size={80} />
          <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Esperando nuevos pedidos...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {pendingOrders.map((order, i) => (
            <div key={order.id} className="glass animate-zoom-in" style={{ 
              borderRadius: '24px', 
              padding: '1.5rem', 
              borderLeft: `6px solid ${order.status === 'pendiente' ? '#facc15' : '#fb923c'}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Outfit' }}>#{order.id.split('-')[1].slice(-4)}</span>
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-accent)' }}>{order.cliente}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#f87171' }}>
                    <Clock size={14} /> {formatTimeAgo(order.timestamp)}
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '1rem' }}>
                {order.items.map(item => (
                  <div key={item.cartId} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{item.cantidad}x {item.nombre}</p>
                        {item.detalles && (
                          <p style={{ margin: 0, fontSize: '0.9rem', color: '#4ade80', fontWeight: 600 }}>
                            {item.detalles}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {order.nota && (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(234,179,8,0.1)', borderRadius: '12px', border: '1px solid rgba(234,179,8,0.2)', color: '#facc15', fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
                    <FileText size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <strong>NOTA:</strong> {order.nota}
                  </div>
                )}
              </div>

              {/* Large Action Button */}
              <button
                onClick={() => handleNextStatus(order.id, order.status)}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  border: 'none',
                  background: order.status === 'pendiente' ? '#ca8a04' : '#16a34a',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                {order.status === 'pendiente' ? (
                  <><ChefHat size={22} /> EMPEZAR A COCINAR</>
                ) : (
                  <><Check size={22} /> PEDIDO LISTO</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
