import { useState, useMemo } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { Check, ChevronRight, ChevronLeft, ShoppingBag, Flame, Utensils, Sparkles, Leaf, Plus, Minus } from 'lucide-react'

export default function WokConfigurator({ onAddToCart, onClose }) {
  const { state } = useStore()
  const { wokConfig } = state

  // Step state: 1: Base, 2: Protein, 3: Principio, 4: Ensalada, 5: Extras
  const [step, setStep] = useState(1)
  
  // Selection state
  const [selectedBase, setSelectedBase] = useState(null)
  const [selectedProteina, setSelectedProteina] = useState(null)
  const [selectedPrincipio, setSelectedPrincipio] = useState(null)
  const [selectedEnsalada, setSelectedEnsalada] = useState(null)
  const [selectedBebida, setSelectedBebida] = useState(null)
  const [selectedExtras, setSelectedExtras] = useState([]) 
  
  const [isAdding, setIsAdding] = useState(false)

  // Subtotal calculation
  const subtotal = useMemo(() => {
    let total = (selectedBase?.precioBase || 0) + (selectedProteina?.precioPorcion || 0)
    selectedExtras.forEach(ex => {
      const data = wokConfig.extras.find(e => e.id === ex.id)
      if (data) total += data.precio * ex.quantity
    })
    if (selectedBebida) total += selectedBebida.precio
    return total
  }, [selectedBase, selectedProteina, selectedExtras, selectedBebida, wokConfig])

  // Handlers
  const toggleExtra = (extra, delta) => {
    setSelectedExtras(prev => {
      const existing = prev.find(e => e.id === extra.id)
      if (!existing && delta > 0) return [...prev, { id: extra.id, quantity: 1 }]
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta)
        if (newQty === 0) return prev.filter(e => e.id !== extra.id)
        return prev.map(e => e.id === extra.id ? { ...e, quantity: newQty } : e)
      }
      return prev
    })
  }

  const handleFinish = () => {
    if (!selectedBase || !selectedProteina) return
    setIsAdding(true)
    
    const extrasInfo = selectedExtras.map(ex => {
      const data = wokConfig.extras.find(e => e.id === ex.id)
      return data ? `${data.nombre} (x${ex.quantity})` : null
    }).filter(Boolean)

    const details = [
      `Base: ${selectedBase.nombre}`,
      `Proteína: ${selectedProteina.nombre}`,
      selectedPrincipio ? `Principio: ${selectedPrincipio.nombre}` : null,
      selectedEnsalada ? `Ensalada: ${selectedEnsalada.nombre}` : null,
      selectedBebida ? `Bebida: ${selectedBebida.nombre}` : null,
      extrasInfo.length > 0 ? `Extras: ${extrasInfo.join(', ')}` : null
    ].filter(Boolean).join(' | ')

    onAddToCart({
      cartId: `wok-${Date.now()}`,
      itemId: 'wok-custom',
      tipo: 'wok',
      nombre: 'Wok Personalizado',
      detalles: details,
      proteinaId: selectedProteina.id,
      extras: selectedExtras.map(e => ({ id: e.id, quantity: e.quantity })),
      subtotal: subtotal,
      cantidad: 1,
      emoji: '🍜'
    })

    setTimeout(() => {
      onClose()
    }, 600)
  }

  const steps = [
    { id: 1, label: 'Base', icon: Utensils },
    { id: 2, label: 'Proteína', icon: Flame },
    { id: 3, label: 'Principio', icon: Sparkles },
    { id: 4, label: 'Ensalada', icon: Leaf },
    { id: 5, label: 'Extras', icon: Plus },
    { id: 6, label: 'Bebida', icon: ShoppingBag },
  ]

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      
      {/* Step Indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
        {steps.map(s => (
          <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ 
              height: 4, borderRadius: 2, 
              background: step >= s.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, textAlign: 'center', color: step >= s.id ? 'var(--color-accent)' : 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginBottom: '1.5rem' }}>
        
        {step === 1 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>1. Selecciona tu base</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>El cimiento de tu wok gourmet</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {wokConfig.bases.filter(b => b.activo).map(b => (
                <button key={b.id} onClick={() => { setSelectedBase(b); setStep(2); }} style={{
                  padding: '1.5rem', borderRadius: '24px', border: '2px solid',
                  borderColor: selectedBase?.id === b.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  background: selectedBase?.id === b.id ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', position: 'relative'
                }}>
                  {selectedBase?.id === b.id && <Check size={16} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--color-accent)' }} />}
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{b.emoji}</div>
                  <div style={{ fontWeight: 800, color: selectedBase?.id === b.id ? 'white' : 'var(--color-text)' }}>{b.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '4px' }}>Incluida</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>2. Elige la proteína</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Proteína fresca preparada al wok</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {wokConfig.proteinas.filter(p => p.activo && p.stock > 0).map(p => (
                <button key={p.id} onClick={() => { setSelectedProteina(p); setStep(3); }} style={{
                  padding: '1.25rem 1rem', borderRadius: '20px', border: '2px solid',
                  borderColor: selectedProteina?.id === p.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  background: selectedProteina?.id === p.id ? 'rgba(234,88,12,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', position: 'relative'
                }}>
                  {selectedProteina?.id === p.id && <Check size={16} style={{ position: 'absolute', top: 10, right: 10, color: 'var(--color-accent)' }} />}
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{p.nombre}</div>
                  <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.85rem' }}>+{formatCOP(p.precioPorcion)}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>3. ¿Algún principio?</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Tradición llanera en tu plato</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {wokConfig.principios.map(p => (
                <button key={p.id} onClick={() => { setSelectedPrincipio(p); setStep(4); }} style={{
                  padding: '1.25rem 1rem', borderRadius: '20px', border: '2px solid',
                  borderColor: selectedPrincipio?.id === p.id ? 'var(--color-oriental)' : 'rgba(255,255,255,0.05)',
                  background: selectedPrincipio?.id === p.id ? 'rgba(79,70,229,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.nombre}</div>
                </button>
              ))}
              <button onClick={() => { setSelectedPrincipio(null); setStep(4); }} style={{
                padding: '1.25rem 1rem', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)',
                background: 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', color: 'var(--color-muted)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🚫</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sin principio</div>
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>4. Elige tu ensalada</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>El toque fresco y saludable</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {wokConfig.ensaladas.map(e => (
                <button key={e.id} onClick={() => { setSelectedEnsalada(e); setStep(5); }} style={{
                  padding: '1.25rem 1rem', borderRadius: '20px', border: '2px solid',
                  borderColor: selectedEnsalada?.id === e.id ? 'var(--color-success)' : 'rgba(255,255,255,0.05)',
                  background: selectedEnsalada?.id === e.id ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{e.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{e.nombre}</div>
                </button>
              ))}
              <button onClick={() => { setSelectedEnsalada(null); setStep(5); }} style={{
                padding: '1.25rem 1rem', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)',
                background: 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', color: 'var(--color-muted)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🚫</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sin ensalada</div>
              </button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>5. ¿Deseas extras?</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Potencia el sabor de tu creación</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {wokConfig.extras.filter(ex => ex.activo && ex.stock > 0).map(ex => {
                const selection = selectedExtras.find(e => e.id === ex.id)
                const qty = selection?.quantity || 0
                return (
                  <div key={ex.id} style={{
                    padding: '1rem 1.25rem', borderRadius: '20px', border: '1px solid',
                    borderColor: qty > 0 ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)',
                    background: qty > 0 ? 'rgba(234,88,12,0.05)' : 'rgba(255,255,255,0.02)',
                    display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
                  }}>
                    <span style={{ fontSize: '1.8rem' }}>{ex.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{ex.nombre}</div>
                      <div style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.85rem' }}>+{formatCOP(ex.precio)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button onClick={() => toggleExtra(ex, -1)} disabled={qty === 0} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty === 0 ? 0.3 : 1 }}>
                        <Minus size={16} />
                      </button>
                      <span style={{ fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => toggleExtra(ex, 1)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--color-accent)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="animate-slide-up">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>6. ¿Qué deseas tomar?</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Acompaña tu wok con una bebida fría</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {state.bebidas.filter(b => b.activo && b.stock > 0).map(b => (
                <button key={b.id} onClick={() => { setSelectedBebida(b); handleFinish(); }} style={{
                  padding: '1.25rem 1rem', borderRadius: '20px', border: '2px solid',
                  borderColor: selectedBebida?.id === b.id ? 'var(--color-oriental)' : 'rgba(255,255,255,0.05)',
                  background: selectedBebida?.id === b.id ? 'rgba(79,70,229,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', position: 'relative'
                }}>
                  {selectedBebida?.id === b.id && <Check size={16} style={{ position: 'absolute', top: 10, right: 10, color: 'var(--color-oriental)' }} />}
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{b.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.nombre}</div>
                  <div style={{ color: 'var(--color-oriental-light)', fontWeight: 800, fontSize: '0.85rem' }}>+{formatCOP(b.precio)}</div>
                </button>
              ))}
              <button onClick={() => { setSelectedBebida(null); handleFinish(); }} style={{
                padding: '1.25rem 1rem', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)',
                background: 'transparent', cursor: 'pointer', transition: 'all 0.25s', textAlign: 'center', color: 'var(--color-muted)'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🚫</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Sin bebida</div>
              </button>
            </div>
          </section>
        )}

      </div>

      {/* Footer Navigation */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600 }}>Total actual</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent)', fontFamily: 'Outfit' }}>{formatCOP(subtotal)}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
              <ChevronLeft size={20} /> Atrás
            </button>
          )}
          
          {step < 6 ? (
            <button 
              onClick={() => {
                if (step === 1 && !selectedBase) return
                if (step === 2 && !selectedProteina) return
                setStep(step + 1)
              }} 
              className="btn-primary" 
              style={{ 
                padding: '0.75rem 1.5rem',
                opacity: (step === 1 && !selectedBase) || (step === 2 && !selectedProteina) ? 0.5 : 1
              }}
            >
              Siguiente <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              onClick={handleFinish} 
              disabled={isAdding}
              className="btn-primary" 
              style={{ 
                padding: '0.75rem 2rem',
                background: isAdding ? 'var(--color-success)' : undefined
              }}
            >
              {isAdding ? <Check size={20} /> : <ShoppingBag size={20} />}
              {isAdding ? '¡Agregado!' : 'Finalizar Wok'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
