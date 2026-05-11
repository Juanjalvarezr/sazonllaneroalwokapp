import { useState, useEffect } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP, formatTimeAgo } from '../../utils/formatters'
import { StockBadge } from '../ui/StockBadge'
import { initialData } from '../../data/initialData'
import { 
  BarChart3, TrendingUp, ShoppingBag, DollarSign, Package, 
  ToggleLeft, ToggleRight, Edit3, Check, X, Plus, Trash2, 
  Settings, ShoppingCart, User, CreditCard, Clock, AlertCircle, QrCode, Smartphone
} from 'lucide-react'
import InventoryManager from '../shared/InventoryManager'
import { saveInventoryCloud } from '../../services/firebaseService'

export default function AdminView() {
  const { state, dispatch } = useStore()
  const { analytics, wokConfig, bebidas, almuerzoEjecutivo, orders, gastos, pins } = state
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'inventario', label: 'Inventario', icon: Package },
    { key: 'gastos', label: 'Gastos', icon: DollarSign },
    { key: 'ajustes', label: 'Ajustes', icon: Settings },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.8rem', margin: '0 0 4px' }}>
            Panel Administrador
          </h1>
          <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.88rem' }}>Control total del restaurante</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '40px', padding: '4px', border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '0.55rem 1.15rem', borderRadius: '36px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
            transition: 'all 0.2s',
            background: activeTab === key ? 'linear-gradient(135deg,#4f46e5,#3730a3)' : 'transparent',
            color: activeTab === key ? 'white' : 'var(--color-muted)',
            boxShadow: activeTab === key ? '0 0 16px rgba(79,70,229,0.35)' : 'none',
          }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <Dashboard analytics={analytics} orders={orders} wokConfig={wokConfig} bebidas={bebidas} almuerzo={almuerzoEjecutivo} />}
      {activeTab === 'inventario' && <InventoryManager />}
      {activeTab === 'gastos' && <GastosManager gastos={gastos} analytics={analytics} />}
      {activeTab === 'ajustes' && <AjustesManager pins={pins} />}
    </div>
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ analytics, orders, wokConfig, bebidas, almuerzo }) {
  const { ventasTotales, cantidadPedidos, ticketPromedio } = analytics
  
  // Calculate payments summary
  const payments = orders.filter(o => o.status === 'entregado').reduce((acc, o) => {
    const p = o.pago || 'efectivo'
    acc[p] = (acc[p] || 0) + o.total
    return acc
  }, {})

  const recentOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

  // Low stock items for replenishment (Bases, Proteins, Extras)
  const lowStock = [
    ...wokConfig.bases.filter(b => b.activo && b.stock < 10),
    ...wokConfig.proteinas.filter(p => p.activo && p.stock < 10),
    ...wokConfig.extras.filter(e => e.activo && e.stock < 10),
    ...bebidas.filter(b => b.activo && b.stock < 10),
    ...(almuerzo.activo && almuerzo.stock < 10 ? [almuerzo] : [])
  ].sort((a, b) => a.stock - b.stock)

  const stats = [
    { label: 'Ventas Totales', value: formatCOP(ventasTotales), icon: TrendingUp, color: '#ea580c', gradient: 'linear-gradient(135deg,rgba(234,88,12,0.15),rgba(234,88,12,0.05))' },
    { label: 'Pedidos Hoy', value: cantidadPedidos, icon: ShoppingBag, color: '#818cf8', gradient: 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(79,70,229,0.05))' },
    { label: 'Ticket Promedio', value: formatCOP(ticketPromedio), icon: BarChart3, color: '#4ade80', gradient: 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))' },
  ]

  const categoryLabels = { almuerzo: '🍱 Almuerzo', wok: '🍜 Wok', bebida: '🥤 Bebida' }
  const categoryColors = { 
    almuerzo: 'var(--color-success)', 
    wok: 'var(--color-accent)', 
    bebida: 'var(--color-oriental-light)' 
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {stats.map(({ label, value, icon: Icon, color, gradient }, i) => (
          <div key={label} className="glass animate-zoom-in" style={{ borderRadius: '24px', padding: '1.5rem', animationDelay: `${i * 0.08}s`, background: gradient, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle,${color}30,transparent)` }} />
            <Icon size={22} color={color} style={{ marginBottom: '0.75rem' }} />
            <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.8rem', color, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown Trends */}
      <div className="glass animate-slide-up" style={{ borderRadius: '24px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="var(--color-accent)" /> Ventas por Categoría (Hoy)
        </h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '1.5rem', height: 180, padding: '0 1rem' }}>
          {Object.entries(analytics.porCategoria || {}).map(([cat, amount]) => {
            const percentage = ventasTotales > 0 ? (amount / ventasTotales) * 100 : 0
            return (
              <div key={cat} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ color: 'var(--color-text)', fontWeight: 800, fontSize: '0.75rem' }}>{formatCOP(amount)}</div>
                <div style={{ 
                  width: '100%', 
                  height: `${Math.max(5, percentage)}%`, 
                  background: categoryColors[cat], 
                  borderRadius: '12px 12px 4px 4px',
                  boxShadow: `0 0 20px ${categoryColors[cat]}40`,
                  transition: 'height 0.5s ease-out'
                }} />
                <div style={{ color: 'var(--color-muted)', fontWeight: 700, fontSize: '0.7rem', textAlign: 'center' }}>{categoryLabels[cat]}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Cierre de Caja (Payments Summary) */}
        <div className="glass animate-slide-up" style={{ borderRadius: '24px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="var(--color-accent)" /> Cierre de Caja (Hoy)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Efectivo', key: 'efectivo', color: '#16a34a' },
              { label: 'Nequi', key: 'nequi', color: '#9333ea' },
              { label: 'Daviplata', key: 'daviplata', color: '#dc2626' },
            ].map(({ label, key, color }) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--color-muted)' }}>{label}</span>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: color, fontSize: '1.05rem' }}>{formatCOP(payments[key] || 0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reposición de Inventario (Low Stock) */}
        <div className="glass animate-slide-up" style={{ borderRadius: '24px', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} color="#facc15" /> Reposición Urgente
          </h3>
          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>Todo el inventario está en niveles óptimos ✅</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lowStock.map(item => (
                <div key={item.id || 'alm'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: item.stock < 5 ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: item.stock < 5 ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{item.emoji || '🍽️'}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.nombre || 'Almuerzo'}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: item.stock < 5 ? '#f87171' : '#facc15' }}>{item.stock} unidades</p>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--color-muted)' }}>Mín: 10</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Order History */}
      <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--color-accent)" /> Historial de Movimientos (Últimos 10)
        </h3>
        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.88rem' }}>Sin movimientos registrados todavía</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recentOrders.map(o => {
              const statusCfg = { 
                pendiente: { color: '#facc15', label: 'Pendiente' }, 
                en_cocina: { color: '#fb923c', label: 'En Cocina' }, 
                entregado: { color: '#4ade80', label: 'Completado' } 
              }
              return (
                <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 120px 110px', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-muted)' }}>{o.id}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.cliente}</p>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--color-muted)' }}>{formatTimeAgo(o.timestamp)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', opacity: 0.8 }}>
                    <CreditCard size={12} /> <span style={{ textTransform: 'capitalize' }}>{o.pago}</span>
                  </div>
                  <div style={{ color: statusCfg[o.status].color, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {statusCfg[o.status].label}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: 'var(--color-accent)', fontSize: '0.95rem' }}>
                    {formatCOP(o.total)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Gastos Manager ────────────────────────────────────────────────────────
function GastosManager({ gastos, analytics }) {
  const { dispatch } = useStore()
  const [form, setForm] = useState({ descripcion: '', monto: '', categoria: 'Insumos' })

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const utilidad = analytics.ventasTotales - totalGastos

  const handleAdd = () => {
    if (!form.descripcion || !form.monto) return
    dispatch({
      type: 'ADD_GASTO',
      gasto: { id: `G-${Date.now()}`, ...form, monto: Number(form.monto), fecha: Date.now() },
    })
    setForm({ descripcion: '', monto: '', categoria: 'Insumos' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Ventas Brutas', value: analytics.ventasTotales, color: '#4ade80' },
          { label: 'Total Gastos', value: totalGastos, color: '#f87171' },
          { label: 'Utilidad Neta', value: utilidad, color: utilidad >= 0 ? '#4ade80' : '#f87171' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass" style={{ borderRadius: '20px', padding: '1.1rem' }}>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>
            <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.5rem', color, margin: 0 }}>{formatCOP(value)}</p>
          </div>
        ))}
      </div>

      {/* Add expense */}
      <div className="glass" style={{ borderRadius: '24px', padding: '1.25rem' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Registrar Gasto</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px auto', gap: '0.75rem', alignItems: 'end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>DESCRIPCIÓN</label>
            <input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={inputStyle} placeholder="Ej: Compra de aceite" />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>MONTO (COP)</label>
            <input type="number" value={form.monto} onChange={e => setForm(f => ({ ...f, monto: e.target.value }))} style={inputStyle} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>CATEGORÍA</label>
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
              {['Insumos', 'Servicios', 'Personal', 'Equipos', 'Otro'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="btn-primary" style={{ whiteSpace: 'nowrap' }}><Plus size={16} /> Agregar</button>
        </div>
      </div>

      {/* List */}
      {gastos.length > 0 && (
        <div className="glass" style={{ borderRadius: '24px', padding: '1.25rem' }}>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1rem' }}>Historial de Gastos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {gastos.map(g => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '999px' }}>{g.categoria}</span>
                <span style={{ flex: 1, fontSize: '0.85rem' }}>{g.descripcion}</span>
                <span style={{ color: '#f87171', fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>{formatCOP(g.monto)}</span>
                <button onClick={() => dispatch({ type: 'DELETE_GASTO', id: g.id })} className="btn-danger" style={{ padding: '0.3rem 0.3rem', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Ajustes Manager ───────────────────────────────────────────────────────
function AjustesManager({ pins }) {
  const { state, dispatch } = useStore()
  const { config, almuerzoEjecutivo: almuerzo } = state
  const [pinVals, setPinVals] = useState({ cajero: pins.cajero, admin: pins.admin })
  const [locVal, setLocVal] = useState(config.ubicacion)
  const [saved, setSaved] = useState(false)

  const handleSavePins = () => {
    if (pinVals.cajero.length < 4 || pinVals.admin.length < 4) return
    dispatch({ type: 'UPDATE_PINS', changes: pinVals })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUpdateConfig = (changes) => {
    dispatch({ type: 'UPDATE_CONFIG', changes })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📍 Ubicación del Carrito (Ambulante)
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            value={locVal} 
            onChange={e => setLocVal(e.target.value)} 
            style={inputStyle} 
            placeholder="Ej: Calle 5 con Cra 10..." 
          />
          <button 
            onClick={() => handleUpdateConfig({ ubicacion: locVal })} 
            className="btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Actualizar Mapa
          </button>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.72rem', marginTop: '0.5rem' }}>Esto aparecerá en el encabezado de todos tus clientes.</p>
      </div>

      {/* Editor de Menú del Día */}
      <div className="glass-orange" style={{ borderRadius: '24px', padding: '1.5rem', maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🍱 Configurar Menú del Día (Almuerzo)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>PROTEÍNA PRINCIPAL</label>
            <input 
              value={almuerzo.proteina} 
              onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { proteina: e.target.value } })} 
              style={inputStyle} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>PRECIO (COP)</label>
            <input 
              type="number"
              value={almuerzo.precio} 
              onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { precio: Number(e.target.value) } })} 
              style={inputStyle} 
            />
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>ACOMPAÑAMIENTOS</label>
          <input 
            value={almuerzo.acompanamiento} 
            onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { acompanamiento: e.target.value } })} 
            style={inputStyle} 
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>STOCK DISPONIBLE</label>
            <input 
              type="number"
              value={almuerzo.stock} 
              onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { stock: Number(e.target.value) } })} 
              style={inputStyle} 
            />
          </div>
          <button 
            className="btn-primary" 
            style={{ alignSelf: 'flex-end', height: '42px' }}
            onClick={() => setSaved(true)}
          >
            Actualizar Almuerzo
          </button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem' }}>🔐 Cambiar PINs de Acceso</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>PIN CAJERO / STAFF</label>
            <input type="password" value={pinVals.cajero} onChange={e => setPinVals(v => ({ ...v, cajero: e.target.value }))} style={{ ...inputStyle, letterSpacing: '0.3em' }} maxLength={8} />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>PIN ADMINISTRADOR</label>
            <input type="password" value={pinVals.admin} onChange={e => setPinVals(v => ({ ...v, admin: e.target.value }))} style={{ ...inputStyle, letterSpacing: '0.3em' }} maxLength={8} />
          </div>
          <button onClick={handleSavePins} className="btn-indigo" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
            {saved ? '✓ Cambios Guardados' : 'Guardar PINs'}
          </button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', maxWidth: 600 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <QrCode size={18} color="var(--color-accent)" /> Menú Digital QR
        </h3>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px' }}>
          <div style={{ background: 'white', padding: '10px', borderRadius: '12px', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Visual simulation of QR */}
            <div style={{ width: '100%', height: '100%', border: '4px solid #000', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 4, left: 4, width: 20, height: 20, border: '4px solid #000' }} />
              <div style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, border: '4px solid #000' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 4, width: 20, height: 20, border: '4px solid #000' }} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '0.5rem', fontWeight: 900 }}>WOK</div>
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: '0.9rem' }}>Escanea para pedir</p>
            <p style={{ margin: '0 0 1rem', color: 'var(--color-muted)', fontSize: '0.75rem' }}>Tus clientes pueden escanear este código para abrir el menú en su celular y armar su Wok.</p>
            <button className="btn-secondary" style={{ fontSize: '0.75rem' }}>
              <Smartphone size={14} /> Probar Vista Móvil
            </button>
          </div>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '24px', padding: '1.5rem', maxWidth: 600, border: '1px solid rgba(239,68,68,0.2)' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '0.5rem', color: '#ef4444' }}>
          🚩 Zona de Peligro
        </h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
          Use esto solo al final del día. Borrará todos los pedidos actuales y reiniciará el contador de ventas a cero.
        </p>
        <button 
          onClick={() => {
            if(window.confirm('¿Estás seguro de cerrar la jornada? Esto borrará el historial de hoy.')) {
              dispatch({ type: 'RESET_DAY' })
            }
          }}
          className="btn-secondary" 
          style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444', justifyContent: 'center', marginBottom: '1rem' }}
        >
          Cerrar Jornada y Reiniciar Día
        </button>

        <button 
          onClick={async () => {
            if(window.confirm('¿Deseas subir el menú inicial a la nube?')) {
              await saveInventoryCloud({
                almuerzoEjecutivo: initialData.almuerzoEjecutivo,
                wokConfig: initialData.wokConfig,
                bebidas: initialData.bebidas
              });
              alert('¡Base de datos inicializada en la nube!');
            }
          }}
          className="btn-primary" 
          style={{ width: '100%', background: '#10b981', justifyContent: 'center' }}
        >
          Inicializar Menú en la Nube
        </button>
      </div>
    </div>
  )
}

// ─── Shared Styles ─────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: 'var(--color-text)',
  padding: '0.6rem 0.9rem',
  fontSize: '0.88rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}
