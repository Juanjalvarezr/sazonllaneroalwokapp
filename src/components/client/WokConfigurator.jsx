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
  }

  const handleFinish = () => {
    if (!selectedBase || !selectedProteina) return
    
    const details = [
      selectedBase.nombre,
      selectedProteina.nombre,
      selectedPrincipio ? `con ${selectedPrincipio.nombre}` : null,
      selectedEnsalada ? `y ${selectedEnsalada.nombre}` : null,
      selectedExtras.length > 0 ? `+ Extras: ${selectedExtras.map(e => e.nombre).join(', ')}` : null
    ].filter(Boolean).join(' | ')

    onAddToCart({
      cartId: `wok-${Date.now()}`,
      itemId: 'wok-custom',
      tipo: 'wok',
      nombre: 'Arma tu Wok',
      detalles: details,
      proteinaId: selectedProteina.id,
      extrasIds: selectedExtras.map(e => e.id),
      subtotal: calculateSubtotal(),
      cantidad,
      emoji: '🍜'
    })
  }

  const toggleExtra = (extra) => {
    if (selectedExtras.find(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id))
    } else {
      setSelectedExtras([...selectedExtras, extra])
    }
  }

  const StepIndicator = () => (
    <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}>
      {[1,2,3,4,5].map(s => (
        <div key={s} style={{ 
          flex: 1, height: 4, borderRadius: 2,
          background: step >= s ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
          transition: 'all 0.3s'
        }} />
      ))}
    </div>
  )

  return (
    <div className="glass animate-fade-in" style={{ borderRadius: '28px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
      <StepIndicator />

      {step === 1 && (
        <section className="animate-slide-up">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 1rem' }}>1. Selecciona tu base</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {wokConfig.bases.filter(b => b.activo).map(b => (
              <button key={b.id} onClick={() => { setSelectedBase(b); setStep(2); }} style={{
                padding: '1.5rem', borderRadius: '20px', border: '2px solid',
                borderColor: selectedBase?.id === b.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                background: selectedBase?.id === b.id ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{b.emoji}</div>
                <div style={{ fontWeight: 800, color: selectedBase?.id === b.id ? 'white' : 'var(--color-muted)' }}>{b.nombre}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="animate-slide-up">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 1rem' }}>2. Elige la proteína</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {wokConfig.proteinas.filter(p => p.activo && p.stock > 0).map(p => (
              <button key={p.id} onClick={() => { setSelectedProteina(p); setStep(3); }} style={{
                padding: '1rem', borderRadius: '18px', border: '2px solid',
                borderColor: selectedProteina?.id === p.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                background: selectedProteina?.id === p.id ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{p.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{p.nombre}</div>
                <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.8rem' }}>+{formatCOP(p.precioPorcion)}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="animate-slide-up">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 1rem' }}>3. ¿Algún principio?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {wokConfig.principios.map(p => (
              <button key={p.id} onClick={() => { setSelectedPrincipio(p); setStep(4); }} style={{
                padding: '1rem', borderRadius: '18px', border: '2px solid',
                borderColor: selectedPrincipio?.id === p.id ? 'var(--color-oriental)' : 'rgba(255,255,255,0.05)',
                background: selectedPrincipio?.id === p.id ? 'rgba(79,70,229,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{p.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.nombre}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="animate-slide-up">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 1rem' }}>4. Elige tu ensalada</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {wokConfig.ensaladas.map(e => (
              <button key={e.id} onClick={() => { setSelectedEnsalada(e); setStep(5); }} style={{
                padding: '1rem', borderRadius: '18px', border: '2px solid',
                borderColor: selectedEnsalada?.id === e.id ? 'var(--color-success)' : 'rgba(255,255,255,0.05)',
                background: selectedEnsalada?.id === e.id ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{e.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{e.nombre}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="animate-slide-up">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 1rem' }}>5. ¿Deseas algún extra? (Opcional)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {wokConfig.extras.filter(ex => ex.activo && ex.stock > 0).map(ex => {
              const isSelected = selectedExtras.find(e => e.id === ex.id)
              return (
                <button key={ex.id} onClick={() => toggleExtra(ex)} style={{
                  padding: '1rem', borderRadius: '18px', border: '2px solid',
                  borderColor: isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  background: isSelected ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '1.2rem' }}>{ex.emoji}</span>
                    {isSelected && <Check size={14} color="var(--color-accent)" />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '4px' }}>{ex.nombre}</div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.8rem' }}>+{formatCOP(ex.precio)}</div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Footer Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary" style={{ padding: '0.6rem 1rem' }}>
              Atrás
            </button>
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
