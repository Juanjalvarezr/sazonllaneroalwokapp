import { useState } from 'react'
import { StoreProvider } from './store/StoreContext'
import { useStore } from './store/StoreContext'
import Navbar from './components/layout/Navbar'
import ClientView from './components/client/ClientView'
import CashierView from './components/cashier/CashierView'
import AdminView from './components/admin/AdminView'
import KitchenView from './components/kitchen/KitchenView'

function AppContent() {
  const [role, setRole] = useState('cliente')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar role={role} setRole={setRole} />
      <main>
        {role === 'cliente' && <ClientView />}
        {role === 'cajero' && <CashierView />}
        {role === 'cocina' && <KitchenView />}
        {role === 'admin' && <AdminView />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
