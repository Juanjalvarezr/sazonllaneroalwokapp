import { useState, useMemo } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { Minus, Plus, ShoppingBag, CheckCircle2, ChevronRight, Utensils } from 'lucide-react'

export default function WokConfigurator({ onAdd, onClose }) {
  const { state } = useStore()
  const { wokConfig } = state

  // Selection state
  const [selectedBase, setSelectedBase] = useState(wokConfig.bases[0])
  const [selectedProteins, setSelectedProteins] = useState([]) // Array of { id, quantity }
  const [selectedExtras, setSelectedExtras] = useState([]) // Array of ids
  const [added, setAdded] = useState(false)

  // Subtotal calculation
  const subtotal = useMemo(() => {
    let total = selectedBase.precioBase
    
    // Proteins
    selectedProteins.forEach(p => {
      const data = wokConfig.proteinas.find(i => i.id === p.id)
      if (data) total += data.precioPorcion * p.quantity
    })
    
    // Extras
    selectedExtras.forEach(id => {
      const data = wokConfig.extras.find(i => i.id === id)
      if (data) total += data.precio
    })
    
    return total
  }, [selectedBase, selectedProteins, selectedExtras, wokConfig])

  // Handlers
  const toggleProtein = (id, change) => {
    setSelectedProteins(prev => {
      const existing = prev.find(p => p.id === id)
      if (!existing && change > 0) return [...prev, { id, quantity: 1 }]
      if (existing) {
        const newQty = Math.max(0, existing.quantity + change)
        if (newQty === 0) return prev.filter(p => p.id !== id)
        return prev.map(p => p.id === id ? { ...p, quantity: newQty } : p)
      }
      return prev
    })
  }

  const toggleExtra = (id) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleAdd = () => {
    setAdded(true)
    
    const proteinSummary = selectedProteins.map(p => {
      const data = wokConfig.proteinas.find(i => i.id === p.id)
      return `${p.quantity}p ${data.nombre}`
    }).join(', ')

    const extrasSummary = selectedExtras.map(id => {
      const data = wokConfig.extras.find(id_ => id_ === id)
      return data?.nombre
    }).filter(Boolean).join(', ')

    setTimeout(() => {
      onAdd({
        cartId: `wok-buffet-${Date.now()}`,
        tipo: 'wok',
        nombre: `Wok Buffet (${selectedBase.nombre}${proteinSummary ? ' + ' + proteinSummary : ''})`,
        detalles: `${proteinSummary} ${extrasSummary ? ' | ' + extrasSummary : ''}`,
        subtotal,
        emoji: '🍜',
        proteinaId: selectedProteins[0]?.id || null, // For stock deduction (primary)
        extrasIds: selectedExtras,
        cantidad: 1, // 1 entire wok
      })
    }, 400)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxHeight: '75vh', overflowY: 'auto', paddingRight: '0.5rem', scrollbarWidth: 'thin' }}>
      
      {/* 1. Seleccionar Base */}
      <section>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          1. Elige la base
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {wokConfig.bases.filter(b => b.activo).map(b => (
            <button key={b.id} onClick={() => setSelectedBase(b)} style={{
              padding: '0.85rem', borderRadius: '16px', border: '2px solid',
              borderColor: selectedBase.id === b.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
              background: selectedBase.id === b.id ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.03)',
              color: selectedBase.id === b.id ? 'var(--color-accent-light)' : 'var(--color-muted)',
              fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{b.emoji}</span> {b.nombre}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Seleccionar Proteínas (Buffet style) */}
      <section>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          2. Añadir Proteínas (porciones)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {wokConfig.proteinas.filter(p => p.activo).map(p => {
            const selected = selectedProteins.find(sp => sp.id === p.id)
            const qty = selected?.quantity || 0
            return (
              <div key={p.id} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', 
                borderRadius: '16px', background: qty > 0 ? 'rgba(79,70,229,0.08)' : 'rgba(255,255,255,0.03)', 
                border: '1px solid', borderColor: qty > 0 ? 'rgba(79,70,229,0.2)' : 'rgba(255,255,255,0.06)' 
              }}>
                <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{p.nombre}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-accent)' }}>+{formatCOP(p.precioPorcion)} / p</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <button onClick={() => toggleProtein(p.id, -1)} disabled={qty === 0} style={{ padding: '4px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', opacity: qty === 0 ? 0.3 : 1 }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '15px', textAlign: 'center', fontWeight: 800, color: qty > 0 ? 'var(--color-oriental-light)' : 'var(--color-muted)' }}>{qty}</span>
                  <button onClick={() => toggleProtein(p.id, 1)} style={{ padding: '4px', borderRadius: '50%', border: 'none', background: 'var(--color-accent)', color: 'white', cursor: 'pointer' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Seleccionar Extras */}
      <section>
        <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600, display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          3. Extras y Acompañamientos
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
          {wokConfig.extras.filter(e => e.activo).map(e => {
            const isActive = selectedExtras.includes(e.id)
            return (
              <button key={e.id} onClick={() => toggleExtra(e.id)} style={{
                padding: '0.75rem 0.5rem', borderRadius: '16px', border: '1px solid',
                borderColor: isActive ? '#4ade80' : 'rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#4ade80' : 'var(--color-muted)',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{e.emoji}</span>
                {e.nombre}
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>+{formatCOP(e.precio)}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Footer sticky-like */}
      <div style={{ 
        position: 'sticky', bottom: 0, left: 0, right: 0, 
        paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', 
        background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' 
      }}>
        <div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.72rem', margin: 0 }}>Total configurado</p>
          <p style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-accent)', margin: 0 }}>
            {formatCOP(subtotal)}
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={added}
          className="btn-primary"
          style={{
            background: added ? 'linear-gradient(135deg,#22c55e,#16a34a)' : undefined,
            fontSize: '1rem', padding: '0.8rem 2rem', borderRadius: '18px'
          }}
        >
          {added ? <CheckCircle2 size={20} /> : <ShoppingBag size={20} />}
          {added ? '¡Agregado!' : 'Agregar Wok'}
        </button>
      </div>
    </div>
  )
}
