import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import { ShoppingCart, UtensilsCrossed, Flame, Beer, MapPin } from 'lucide-react'
import MenuRapido from './MenuRapido'
import MenuWoks from './MenuWoks'
import Cart from './Cart'

export default function ClientView({ isStaffMode = false }) {
  const { state, dispatch } = useStore()
  const [cartOpen, setCartOpen] = useState(false)

  const cart = state.cart
  const cartTotal = cart.reduce((s, i) => s + i.subtotal, 0)

  const handleAddToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item })
    // Open cart automatically on first item to guide user
    if (cart.length === 0) setCartOpen(true)
  }

  const handleRemove = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', cartId })
  }

  const handleConfirm = () => {
    setCartOpen(false)
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: cartOpen ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start', transition: 'grid-template-columns 0.3s' }}>
      
      {/* Left Menu Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* 1. HERO - BIENVENIDA */}
        <div className="glass-orange animate-slide-up" style={{ borderRadius: '32px', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(34,197,94,0.3)' }}>
                ● EN VIVO
              </div>
              <span style={{ color: 'var(--color-accent-light)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {state.config.ubicacion}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '8px' }}>
               <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                  height: '80px', 
                  width: '80px', 
                  borderRadius: '20px', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                  border: '3px solid rgba(255,255,255,0.1)'
                }} 
              />
              <div>
                <h1 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: '2.8rem', margin: 0, lineHeight: 1 }}>
                  SAZÓN LLANERO
                </h1>
                <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.15em' }}>
                  AL WOK
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>
              Sabores llaneros y técnica oriental. ¡Ven por el tuyo!
            </p>
          </div>
          
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="btn-primary animate-pulse-orange"
            style={{ position: 'relative', fontSize: '1rem', padding: '0.85rem 1.75rem', height: 'fit-content' }}
          >
            <ShoppingCart size={22} />
            Mi Carrito
            {cart.length > 0 && (
              <span style={{
                position: 'absolute', top: -8, right: -8,
                width: 24, height: 24, borderRadius: '50%',
                background: '#22c55e', color: 'white',
                fontSize: '0.75rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--color-bg)',
                boxShadow: '0 0 10px rgba(34,197,94,0.4)'
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* 2. MENÚ DEL DÍA (ALMUERZO ESPECIAL) */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <UtensilsCrossed size={22} color="#4ade80" />
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Menú del Día</h2>
            <div style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>Fresco y Rápido</div>
          </div>
          <MenuRapido onAddToCart={handleAddToCart} />
        </section>

        {/* 3. ARMA TU PLATO (WOK GOURMET) */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Flame size={22} color="var(--color-accent)" />
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Experiencia Wok Gourmet</h2>
            <div style={{ background: 'rgba(234,88,12,0.1)', color: 'var(--color-accent)', fontSize: '0.7rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', textTransform: 'uppercase' }}>Buffet a la mesa</div>
          </div>
          <MenuWoks onAddToCart={handleAddToCart} />
        </section>

        {/* 4. BEBIDAS Y REFRESCOS */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Beer size={22} color="#818cf8" />
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Bebidas y Refrescos</h2>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             {/* We can directly map bebidas here or keep MenuBebidas component if created */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
               {state.bebidas.filter(b => b.activo).map(b => (
                 <div key={b.id} className="glass card" style={{ borderRadius: '20px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{b.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{b.nombre}</p>
                      <p style={{ margin: 0, color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.9rem' }}>{formatCOP(b.precio)}</p>
                    </div>
                    <button onClick={() => handleAddToCart({ cartId: `${b.id}-${Date.now()}`, itemId: b.id, tipo: 'bebida', nombre: b.nombre, subtotal: b.precio, emoji: b.emoji, cantidad: 1 })} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlusCircle size={20} />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </section>
      </div>

      {/* Right Cart Panel (Floating sticky) */}
      {cartOpen && (
        <div className="glass animate-slide-up" style={{ borderRadius: '32px', padding: '1.5rem', position: 'sticky', top: '100px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShoppingCart size={20} color="var(--color-accent)" />
              Mi Carrito
            </h2>
            {cart.length > 0 && (
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>
                {formatCOP(cartTotal)}
              </span>
            )}
          </div>
          <Cart items={cart} onRemove={handleRemove} onConfirm={handleConfirm} isStaffMode={isStaffMode} />
        </div>
      )}
    </div>
  )
}

// Inline helper for bebidas section
import { PlusCircle } from 'lucide-react'
