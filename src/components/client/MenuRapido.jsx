import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { StockBadge } from '../ui/StockBadge'
import { Plus, Sun, ChefHat, Timer } from 'lucide-react'

export default function MenuRapido({ onAddToCart }) {
  const { state } = useStore()
  const { almuerzoEjecutivo } = state
  const [added, setAdded] = useState(false)

  const handleAddAlmuerzo = () => {
    if (!almuerzoEjecutivo.activo || almuerzoEjecutivo.stock === 0) return
    onAddToCart({
      cartId: `almuerzo-${Date.now()}`,
      tipo: 'almuerzo',
      itemId: 'almuerzo',
      nombre: `Almuerzo: ${almuerzoEjecutivo.proteina}`,
      cantidad: 1,
      subtotal: almuerzoEjecutivo.precio,
      emoji: '🍱',
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <div className="glass-orange card animate-slide-up" style={{ borderRadius: '32px', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.15), transparent)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Left: Plate Preview */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '120px', margin: '0 auto' }}>
          <div style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>🍱</div>
          <div style={{ position: 'absolute', bottom: 5, right: 0, background: '#4ade80', color: 'black', borderRadius: '50%', padding: '4px', border: '2px solid white' }}>
            <Sun size={14} />
          </div>
        </div>

        {/* Middle: Content */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', textTransform: 'uppercase' }}>
              Hoy te recomendamos
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-muted)', fontSize: '0.72rem' }}>
              <Timer size={12} /> Listo en 5 min
            </div>
          </div>
          
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.6rem', margin: '0 0 4px' }}>
            {almuerzoEjecutivo.proteina}
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.92rem', margin: '0 0 1rem', lineHeight: 1.4 }}>
            Acompañado de {almuerzoEjecutivo.acompanamiento}. Nuestra opción más balanceada y rápida.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600 }}>PRECIO ESPECIAL</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Outfit,sans-serif', marginTop: '-2px' }}>
                {formatCOP(almuerzoEjecutivo.precio)}
              </span>
            </div>
            <div style={{ height: 30, width: 1, background: 'rgba(255,255,255,0.1)' }} />
            <StockBadge stock={almuerzoEjecutivo.stock} />
          </div>
        </div>

        {/* Right: CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleAddAlmuerzo}
            disabled={!almuerzoEjecutivo.activo || almuerzoEjecutivo.stock === 0}
            className="btn-primary"
            style={{
              padding: '1.25rem 2rem',
              borderRadius: '20px',
              fontSize: '1.1rem',
              width: '100%',
              minWidth: 180,
              background: added ? '#16a34a' : 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 10px 25px rgba(22,163,74,0.3)',
              transform: added ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {added ? '✓ ¡LISTO!' : '¡Llévalo Ahora!'}
          </button>
          <p style={{ margin: 0, textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-muted)', fontWeight: 600 }}>
            <ChefHat size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Calidad Garantizada
          </p>
        </div>
      </div>
    </div>
  )
}
