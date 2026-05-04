import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP, formatDate, formatTimeAgo } from '../../utils/formatters'
import { StockBadge } from '../ui/StockBadge'
import { Clock, ChefHat, CheckCircle, Package, AlertTriangle, User, CreditCard, FileText, ShoppingCart, LayoutDashboard, PlusCircle, ClipboardList } from 'lucide-react'
import ClientView from '../client/ClientView'
import InventoryManager from '../shared/InventoryManager'

const STATUS_CONFIG = {
  pendiente:   { label: 'Pendiente',  next: 'en_cocina',  nextLabel: 'Pasar a Cocina', color: '#facc15', bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.3)',   icon: Clock      },
  en_cocina:   { label: 'En Cocina', next: 'entregado',  nextLabel: 'Marcar Entregado', color: '#fb923c', bg: 'rgba(234,88,12,0.12)',  border: 'rgba(234,88,12,0.3)',   icon: ChefHat    },
  entregado:   { label: 'Entregado', next: null,         nextLabel: null,               color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',  icon: CheckCircle},
}

export default function CashierView() {
  const { state, dispatch } = useStore()
  const { orders, woks, bebidas, almuerzoEjecutivo } = state
  const [activeTab, setActiveTab] = useState('pedidos') // pedidos, pos, inventario

  const criticalWoks    = woks.filter(w => w.activo && w.stock > 0 && w.stock < 5)
  const criticalBebidas = bebidas.filter(b => b.activo && b.stock > 0 && b.stock < 5)
  const almCritical     = almuerzoEjecutivo.activo && almuerzoEjecutivo.stock < 5 && almuerzoEjecutivo.stock > 0

  const activeOrders = orders.filter(o => o.status !== 'entregado')
  const deliveredToday = orders.filter(o => o.status === 'entregado')

  const handleStatus = (orderId, nextStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', orderId, status: nextStatus })
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
      {/* Header with Tabs */}
      <div className="animate-slide-up" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.8rem', margin: '0 0 4px' }}>
            <Package size={24} color="var(--color-accent)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Panel de Staff
          </h1>
          <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.88rem' }}>
            {activeOrders.length} pedidos activos · {deliveredToday.length} entregados hoy
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '40px', padding: '4px', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { key: 'pedidos', label: 'Pedidos', icon: LayoutDashboard },
            { key: 'pos', label: 'Tomar Pedido', icon: PlusCircle },
            { key: 'inventario', label: 'Inventario', icon: ClipboardList },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '36px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              transition: 'all 0.2s',
              background: activeTab === key ? 'linear-gradient(135deg,#ea580c,#c2410c)' : 'transparent',
              color: activeTab === key ? 'white' : 'var(--color-muted)',
              boxShadow: activeTab === key ? '0 0 16px rgba(234,88,12,0.3)' : 'none',
            }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'pos' && (
        <div className="animate-fade-in">
          <ClientView isStaffMode={true} />
        </div>
      )}

      {activeTab === 'inventario' && (
        <div className="animate-fade-in">
          <InventoryManager />
        </div>
      )}

      {activeTab === 'pedidos' && (
        <div className="animate-fade-in">
          {/* Stock alerts */}
          {(criticalWoks.length > 0 || criticalBebidas.length > 0 || almCritical) && (
            <div className="animate-slide-up" style={{ marginBottom: '1.5rem', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: '20px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', color: '#facc15', fontWeight: 700 }}>
                <AlertTriangle size={16} /> Stock Crítico (menos de 5 unidades)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {almCritical && (
                  <span className="badge-yellow">🍽️ Almuerzo: {almuerzoEjecutivo.stock} uds</span>
                )}
                {criticalWoks.map(w => (
                  <span key={w.id} className="badge-yellow">{w.emoji} {w.nombre}: {w.stock} uds</span>
                ))}
                {criticalBebidas.map(b => (
                  <span key={b.id} className="badge-yellow">{b.emoji} {b.nombre}: {b.stock} uds</span>
                ))}
              </div>
            </div>
          )}

          {/* Orders grid */}
          {activeOrders.length === 0 ? (
            <div className="glass animate-zoom-in" style={{ borderRadius: '28px', padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem', opacity: 0.3 }}>🍽️</div>
              <p style={{ color: 'var(--color-muted)' }}>No hay pedidos activos en este momento</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
              {activeOrders.map((order, i) => {
                const cfg = STATUS_CONFIG[order.status]
                const Icon = cfg.icon
                return (
                  <div key={order.id} className="glass animate-zoom-in" style={{ borderRadius: '24px', padding: '1.5rem', animationDelay: `${i * 0.07}s`, borderLeft: `4px solid ${cfg.color}`, position: 'relative' }}>
                    {/* Order header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-accent)' }}>{order.id}</span>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-muted)' }}>{formatTimeAgo(order.timestamp)}</span>
                        </div>
                        <p style={{ color: 'var(--color-muted)', fontSize: '0.65rem', margin: '2px 0 0' }}>{formatDate(order.timestamp)}</p>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Icon size={14} /> {cfg.label}
                      </div>
                    </div>

                    {/* Client Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                        <User size={14} color="var(--color-muted)" />
                        {order.cliente || 'Anónimo'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                        <CreditCard size={14} color="var(--color-muted)" />
                        <span style={{ textTransform: 'capitalize' }}>{order.pago}</span>
                      </div>
                      {order.nota && (
                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                          <FileText size={14} style={{ marginTop: 2 }} />
                          "{order.nota}"
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                      {order.items.map(item => (
                        <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                          <span>{item.emoji}</span>
                          <span style={{ flex: 1, color: 'var(--color-text)', opacity: 0.9 }}>{item.nombre}</span>
                          <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>x{item.cantidad}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Total</span>
                      <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: 'var(--color-accent)', fontSize: '1.2rem' }}>{formatCOP(order.total)}</span>
                    </div>

                    {/* Action button */}
                    {cfg.next && (
                      <button
                        onClick={() => handleStatus(order.id, cfg.next)}
                        className="btn-primary"
                        style={{ 
                          width: '100%', 
                          justifyContent: 'center', 
                          marginTop: '1rem', 
                          padding: '0.75rem', 
                          background: order.status === 'en_cocina' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : undefined, 
                          boxShadow: order.status === 'en_cocina' ? '0 0 20px rgba(34,197,94,0.3)' : undefined 
                        }}
                      >
                        {cfg.nextLabel}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Delivered today */}
          {deliveredToday.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle size={20} color="#4ade80" /> Historial de Entregados Hoy ({deliveredToday.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {deliveredToday.map(o => (
                  <div key={o.id} className="glass" style={{ borderRadius: '16px', padding: '0.75rem 1rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={14} color="#4ade80" />
                      <div>
                        <p style={{ margin: 0, fontWeight: 700 }}>{o.id}</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-muted)' }}>{o.cliente}</p>
                      </div>
                    </div>
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem' }}>{formatCOP(o.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
