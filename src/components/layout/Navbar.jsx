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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: isCliente ? 0 : 1 }}>
          <img 
            src="/Sazon%20llanero%20logo.png" 
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

        {/* Right: role indicator */}
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
