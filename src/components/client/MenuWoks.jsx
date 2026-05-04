import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { formatCOP } from '../../utils/formatters'
import Modal from '../ui/Modal'
import WokConfigurator from './WokConfigurator'
import { Flame, ChevronRight, PlusCircle } from 'lucide-react'

export default function MenuWoks({ onAddToCart }) {
  const { state } = useStore()
  const { wokConfig } = state
  const [open, setOpen] = useState(false)

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <Flame size={20} color="var(--color-accent)" />
        <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Woks Gourmet
        </h2>
        <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>— Experiencia Buffet al Wok</span>
      </div>

      <div 
        onClick={() => setOpen(true)}
        className="glass animate-slide-up"
        style={{
          borderRadius: '32px',
          padding: '2.5rem 2rem',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(234,88,12,0.12), rgba(79,70,229,0.08))',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = '0 20px 50px rgba(234,88,12,0.2)'
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(234,88,12,0.2), transparent)' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ 
            fontSize: '4.5rem', 
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' 
          }}>🍜</div>
          
          <div style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1.8rem', margin: '0 0 8px' }}>
              Arma tu Wok Gourmet
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', margin: '0 0 1.25rem', lineHeight: 1.5, maxWidth: 500 }}>
              Elige tu base favorita, las proteínas que desees por porciones y añade todos los extras del buffet que quieras. Hecho al wok frente a ti.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-accent-light)', fontWeight: 700 }}>
                <PlusCircle size={15} /> 2 Bases
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--color-oriental-light)', fontWeight: 700 }}>
                <PlusCircle size={15} /> 4 Proteínas
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#4ade80', fontWeight: 700 }}>
                <PlusCircle size={15} /> 5+ Acompañamientos
              </div>
            </div>
          </div>
          
          <div style={{ 
            background: 'var(--color-accent)', 
            color: 'white', 
            width: 56, height: 56, 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(234,88,12,0.4)'
          }}>
            <ChevronRight size={28} />
          </div>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="🔥 Configura tu Wok" size="md">
        <WokConfigurator 
          onAdd={(item) => { onAddToCart(item); setOpen(false) }} 
          onClose={() => setOpen(false)} 
        />
      </Modal>
    </section>
  )
}
