import { useState, useEffect } from 'react'
import { useStore } from '../../store/StoreContext'
import { ShoppingCart, Flame, ChefHat, User, Settings, LogOut, Utensils } from 'lucide-react'
import Modal from '../ui/Modal'
import PinPad from '../ui/PinPad'

export default function Navbar({ role, setRole }) {
  const { state } = useStore()
  const [showPinModal, setShowPinModal] = useState(false)
  const [targetRole, setTargetRole] = useState(null)

  const handleRoleChange = (newRole) => {
    if (newRole === 'cliente') { setRole('cliente'); return }
    setTargetRole(newRole)
    setShowPinModal(true)
  }

  useEffect(() => {
    const handleRequest = (e) => handleRoleChange(e.detail)
    window.addEventListener('requestRoleChange', handleRequest)
    return () => window.removeEventListener('requestRoleChange', handleRequest)
  }, [])

  const handlePin = (pin) => {
    // Kitchen uses same PIN as cashier for simplicity, or admin can enter
    if (!state?.pins) return false
    const expected = (targetRole === 'cajero' || targetRole === 'cocina') ? state.pins.cajero : state.pins.admin
    if (pin === expected) {
      setRole(targetRole)
      setShowPinModal(false)
      return true
    }
    return false
  }

  const roleLabels = {
    cliente: 'Modo Cliente',
    cajero: 'Modo Caja',
    cocina: 'Modo Cocina',
    admin: 'Administrador'
  }

  const roleIcons = {
    cliente: User,
    cajero: ShoppingCart,
    cocina: Utensils,
    admin: Settings
  }

  const isCliente = role === 'cliente'

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: isCliente ? 'none' : 'blur(20px)',
        background: isCliente ? 'transparent' : 'rgba(2,6,23,0.85)',
        borderBottom: isCliente ? 'none' : '1px solid rgba(255,255,255,0.07)',
        padding: isCliente ? '1rem 1.5rem 0' : '0.85rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap'
      }}>
        {/* Logo (Minimal on client, Full on staff) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 1 }}>
          <img 
            src="/logo-sazon.png" 
            alt="Logo" 
            style={{ 
              height: '32px', 
              width: '32px', 
              borderRadius: '8px', 
              objectFit: 'cover'
            }} 
          />
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1rem', color: 'white' }}>
            SAZÓN LLANERO
          </span>
        </div>

        {/* Role tabs (Discreet for staff access) */}
        <div style={{ 
          display: 'flex', gap: '0.3rem', 
          background: isCliente ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)', 
          borderRadius: '40px', padding: '4px', 
          border: isCliente ? 'none' : '1px solid rgba(255,255,255,0.08)',
          marginLeft: 'auto'
        }}>
          {[
            { key: 'cliente', label: 'Inicio', icon: User },
            { key: 'cajero', label: 'Caja', icon: ShoppingCart },
            { key: 'cocina', label: 'Cocina', icon: Utensils },
            { key: 'admin', label: 'Admin', icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => handleRoleChange(key)} style={{
              padding: isCliente ? '0.5rem' : '0.45rem 0.8rem',
              borderRadius: '36px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.72rem',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              transition: 'all 0.2s',
              background: role === key ? 'linear-gradient(135deg,#ea580c,#c2410c)' : 'transparent',
              color: role === key ? 'white' : 'rgba(255,255,255,0.3)',
              boxShadow: role === key ? '0 0 12px rgba(234,88,12,0.2)' : 'none',
            }}>
              <Icon size={14} />
              {!isCliente && label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isCliente && (
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('toggleCart'))}
              style={{ 
                position: 'relative', 
                background: 'rgba(234,88,12,0.1)', 
                border: '1px solid rgba(234,88,12,0.3)',
                padding: '8px', 
                borderRadius: '12px', 
                color: 'var(--color-accent)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ShoppingCart size={20} />
              {state.cart.length > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#22c55e', color: 'white',
                  fontSize: '0.65rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--color-surface)'
                }}>
                  {state.cart.length}
                </span>
              )}
            </button>
          )}

          {!isCliente && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                padding: '0.4rem 0.8rem', borderRadius: '40px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.75rem', fontWeight: 600,
                color: 'white',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <ChefHat size={13} />
                {roleLabels[role]}
              </div>
              <button className="btn-danger" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => setRole('cliente')}>
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* PIN Modal */}
      <Modal isOpen={showPinModal} onClose={() => setShowPinModal(false)}
        title={targetRole === 'admin' ? '⚙️ Acceso Administrador' : '🔐 Acceso Staff'} size="sm">
        <PinPad
          title={`PIN de ${targetRole === 'admin' ? 'Administrador' : 'Staff'}`}
          onSuccess={handlePin}
          onCancel={() => setShowPinModal(false)}
        />
      </Modal>
    </>
  )
}
