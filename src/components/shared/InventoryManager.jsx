import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { StockBadge } from '../ui/StockBadge'
import { ToggleLeft, ToggleRight, Edit3, Check, X, Plus, Trash2 } from 'lucide-react'

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

const toggleBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
  padding: '0.35rem 0.75rem', borderRadius: '999px',
  border: '1px solid', cursor: 'pointer',
  fontSize: '0.75rem', fontWeight: 600,
  transition: 'all 0.2s',
}

export default function InventoryManager() {
  const { state, dispatch } = useStore()
  const { wokConfig, bebidas, almuerzoEjecutivo } = state
  const [editId, setEditId] = useState(null)
  const [editVals, setEditVals] = useState({})
  const [newOption, setNewOption] = useState({ category: 'bases', nombre: '', emoji: '🍲', precio: 0, stock: 99 })

  const startEdit = (id, item) => { 
    setEditId(id)
    setEditVals({ 
      precio: item.precioBase || item.precioPorcion || item.precio, 
      stock: item.stock ?? 999, 
      nombre: item.nombre 
    }) 
  }
  const cancelEdit = () => { setEditId(null); setEditVals({}) }

  const saveOption = (category, id) => {
    const changes = { 
      nombre: editVals.nombre,
      stock: Number(editVals.stock)
    }
    if (category === 'bases') changes.precioBase = Number(editVals.precio)
    else if (category === 'proteinas') changes.precioPorcion = Number(editVals.precio)
    else changes.precio = Number(editVals.precio)

    dispatch({ type: 'UPDATE_WOK_CONFIG', category, id, changes })
    cancelEdit()
  }

  const handleAdd = (category) => {
    if (!newOption.nombre) return
    const id = `${category}-${Date.now()}`
    const item = { 
      id, 
      nombre: newOption.nombre, 
      emoji: newOption.emoji, 
      activo: true 
    }
    if (category === 'bases') item.precioBase = Number(newOption.precio)
    else if (category === 'proteinas') { item.precioPorcion = Number(newOption.precio); item.stock = Number(newOption.stock) }
    else { item.precio = Number(newOption.precio); item.stock = Number(newOption.stock) }

    dispatch({ type: 'ADD_WOK_OPTION', category, item })
    setNewOption({ category: 'bases', nombre: '', emoji: '🍲', precio: 0, stock: 99 })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 🍽️ ALMUERZO EJECUTIVO */}
      <section className="glass" style={{ borderRadius: '24px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🍱 Almuerzo Ejecutivo del Día
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>PROTEÍNA</label>
            <input value={almuerzoEjecutivo.proteina} onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { proteina: e.target.value } })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>PRECIO</label>
            <input type="number" value={almuerzoEjecutivo.precio} onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { precio: Number(e.target.value) } })} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>STOCK</label>
            <input type="number" value={almuerzoEjecutivo.stock} onChange={e => dispatch({ type: 'UPDATE_ALMUERZO', changes: { stock: Number(e.target.value) } })} style={inputStyle} />
          </div>
          <button
            onClick={() => dispatch({ type: 'UPDATE_ALMUERZO', changes: { activo: !almuerzoEjecutivo.activo } })}
            style={{ ...toggleBtnStyle, height: 42, color: almuerzoEjecutivo.activo ? '#4ade80' : '#94a3b8', borderColor: almuerzoEjecutivo.activo ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)', background: almuerzoEjecutivo.activo ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)' }}
          >
            {almuerzoEjecutivo.activo ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            {almuerzoEjecutivo.activo ? 'Activo' : 'Inactivo'}
          </button>
        </div>
      </section>

      {/* 🍜 WOK CONFIGURATION (BUFFET) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.4rem', margin: '0.5rem 0' }}>Configuración Buffet Wok</h2>
        
        {['bases', 'proteinas', 'extras'].map(cat => (
          <div key={cat} className="glass" style={{ borderRadius: '24px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>
                {cat === 'proteinas' ? '🥩 Proteínas' : cat === 'bases' ? '🍚 Bases' : '🥗 Extras'}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wokConfig[cat].map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    {editId === item.id ? (
                      <input value={editVals.nombre} onChange={e => setEditVals(v => ({...v, nombre: e.target.value}))} style={{...inputStyle, padding: '4px 8px'}} />
                    ) : (
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{item.nombre}</p>
                    )}
                  </div>

                  {editId === item.id ? (
                    <>
                      <input type="number" value={editVals.precio} onChange={e => setEditVals(v => ({...v, precio: e.target.value}))} style={{...inputStyle, width: 90}} />
                      {cat !== 'bases' && <input type="number" value={editVals.stock} onChange={e => setEditVals(v => ({...v, stock: e.target.value}))} style={{...inputStyle, width: 70}} />}
                      <button onClick={() => saveOption(cat, item.id)} className="btn-primary" style={{padding: '0.5rem'}}><Check size={14} /></button>
                      <button onClick={cancelEdit} className="btn-secondary" style={{padding: '0.5rem'}}><X size={14} /></button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem' }}>{formatCOP(item.precioBase || item.precioPorcion || item.precio)}</span>
                      {cat !== 'bases' && <StockBadge stock={item.stock} />}
                      <button onClick={() => startEdit(item.id, item)} className="btn-secondary" style={{padding: '0.5rem'}}><Edit3 size={14} /></button>
                      <button onClick={() => dispatch({ type: 'DELETE_WOK_OPTION', category: cat, id: item.id })} className="btn-danger" style={{padding: '0.5rem'}}><Trash2 size={14} /></button>
                    </>
                  )}
                </div>
              ))}

              {/* Add New Option */}
              <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 100px 80px auto', gap: '0.5rem', marginTop: '0.5rem', padding: '0.75rem', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '16px' }}>
                <input value={newOption.emoji} onChange={e => setNewOption({...newOption, emoji: e.target.value})} style={{...inputStyle, textAlign: 'center'}} placeholder="🍗" />
                <input value={newOption.nombre} onChange={e => setNewOption({...newOption, nombre: e.target.value})} style={inputStyle} placeholder="Nombre..." />
                <input type="number" value={newOption.precio} onChange={e => setNewOption({...newOption, precio: e.target.value})} style={inputStyle} placeholder="Precio" />
                <input type="number" value={newOption.stock} onChange={e => setNewOption({...newOption, stock: e.target.value})} style={inputStyle} placeholder="Stock" />
                <button onClick={() => handleAdd(cat)} className="btn-primary"><Plus size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 🥤 BEBIDAS */}
      <section className="glass" style={{ borderRadius: '24px', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: '1.25rem' }}>🥤 Bebidas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bebidas.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>{b.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{b.nombre}</p>
              </div>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{formatCOP(b.precio)}</span>
              <StockBadge stock={b.stock} />
              <button onClick={() => dispatch({ type: 'UPDATE_BEBIDA', id: b.id, changes: { activo: !b.activo } })} style={{ ...toggleBtnStyle, color: b.activo ? '#4ade80' : '#94a3b8' }}>
                {b.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
