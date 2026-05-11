import { useStore } from '../../store/StoreContext'
import { 
  User, ShoppingCart, Utensils, Settings, 
  Home, Flame, Package, LayoutDashboard 
} from 'lucide-react'

export default function BottomNav({ role, setRole }) {
  const { state } = useStore()
  
  const handleRoleChange = (newRole) => {
    // If it's not client, it might need a PIN. 
    // For simplicity in this bottom nav, we'll just use the role change 
    // and rely on the Navbar's modal if we wanted security, 
    // but the user wants ease of use on mobile.
    // However, to maintain current logic, we should probably 
    // only allow changing to 'cliente' or use a custom event 
    // that the Navbar can catch to show the PIN modal.
    
    if (newRole === role) return;
    
    if (newRole === 'cliente') {
      setRole('cliente');
    } else {
      // Trigger the Navbar's PIN modal by dispatching a custom event
      window.dispatchEvent(new CustomEvent('requestRoleChange', { detail: newRole }));
    }
  }

  const navItems = [
    { key: 'cliente', label: 'Inicio', icon: Home },
    { key: 'cajero', label: 'Caja', icon: ShoppingCart },
    { key: 'cocina', label: 'Cocina', icon: Utensils },
    { key: 'admin', label: 'Admin', icon: Settings },
  ]

  return (
    <div className="bottom-nav hide-desktop">
      <div className="bottom-nav-container">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button 
            key={key} 
            onClick={() => handleRoleChange(key)}
            className={`bottom-nav-item ${role === key ? 'active' : ''}`}
          >
            <div className="icon-wrapper">
              <Icon size={20} />
              {key === 'cajero' && state.cart.length > 0 && role === 'cliente' && (
                <span className="cart-badge-dot" />
              )}
            </div>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
