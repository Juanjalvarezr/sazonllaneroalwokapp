import { useState } from 'react'
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

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        backdropFilter: 'blur(20px)',
        background: 'rgba(2,6,23,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0.85rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/Sazon%20llanero%20logo.png" 
            alt="Logo" 
            style={{ 
              height: '42px', 
              width: '42px', 
              borderRadius: '12px', 
              objectFit: 'cover',
              border: '2px solid rgba(234,88,12,0.5)',
              boxShadow: '0 0 15px rgba(234,88,12,0.3)'
            }} 
          />
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: 'white', letterSpacing: '0.02em', display: 'block', lineHeight: 1 }}>
              SAZÓN LLANERO
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.15em' }}>
              AL WOK
            </span>
          </div>
        </div>

        {/* Role tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', borderRadius: '40px', padding: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { key: 'cliente', label: 'Cliente', icon: User },
            { key: 'cajero', label: 'Caja', icon: ShoppingCart },
            { key: 'cocina', label: 'Cocina', icon: Utensils },
            { key: 'admin', label: 'Admin', icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => handleRoleChange(key)} style={{
              padding: '0.45rem 1rem',
              borderRadius: '36px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
              background: role === key ? 'linear-gradient(135deg,#ea580c,#c2410c)' : 'transparent',
              color: role === key ? 'white' : 'var(--color-muted)',
              boxShadow: role === key ? '0 0 16px rgba(234,88,12,0.3)' : 'none',
            }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Right: role indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.4rem 1rem', borderRadius: '40px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.75rem', fontWeight: 600,
            color: 'white',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <ChefHat size={13} />
            {roleLabels[role]}
          </div>
          {role !== 'cliente' && (
            <button className="btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setRole('cliente')}>
              <LogOut size={13} /> Salir
            </button>
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
