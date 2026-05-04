import { createContext, useContext, useReducer, useEffect } from 'react'
import { initialData } from '../data/initialData'
import { saveOrderCloud, listenOrders, updateOrderStatusCloud, syncConfig } from '../services/firebaseService'

const StoreContext = createContext(null)
const STORAGE_KEY = 'sgr_sazon_llanero_v1'

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.wokConfig || parsed.woks) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch { return null }
}

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'SYNC_CLOUD_ORDERS':
      return { ...state, orders: action.orders }

    case 'SYNC_CLOUD_CONFIG':
      return { ...state, config: { ...state.config, ...action.config } }

    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.cartId === action.payload.cartId)
      if (existing) return state
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(i => i.cartId !== action.cartId) }
    case 'CLEAR_CART':
      return { ...state, cart: [] }

    case 'PLACE_ORDER': {
      const order = {
        id: `ORD-${Date.now()}`,
        items: state.cart,
        total: state.cart.reduce((s, i) => s + i.subtotal, 0),
        status: 'pendiente',
        timestamp: Date.now(),
        cliente: action.cliente || 'Anónimo',
        pago: action.pago || 'efectivo',
        nota: action.nota || '',
        mesa: action.mesa || null,
      }
      // Push to cloud
      saveOrderCloud(order)
      return { ...state, cart: [] } // Local state will sync back from cloud listener
    }

    case 'UPDATE_ORDER_STATUS': {
      // Push status update to cloud
      updateOrderStatusCloud(action.orderId, action.status)
      
      // Local stock deduction logic remains (can be moved to server-side in future)
      const updatedOrders = state.orders.map(o =>
        o.id === action.orderId ? { ...o, status: action.status } : o
      )
      
      let updatedWokConfig = state.wokConfig
      let updatedBebidas = state.bebidas
      let updatedAlmuerzo = state.almuerzoEjecutivo

      if (action.status === 'en_cocina') {
        const order = state.orders.find(o => o.id === action.orderId)
        if (order) {
          order.items.forEach(item => {
            if (item.tipo === 'wok') {
              updatedWokConfig = {
                ...updatedWokConfig,
                proteinas: updatedWokConfig.proteinas.map(p => 
                  p.id === item.proteinaId ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p
                ),
                extras: updatedWokConfig.extras.map(e => 
                  item.extrasIds?.includes(e.id) ? { ...e, stock: Math.max(0, e.stock - item.cantidad) } : e
                )
              }
            } else if (item.tipo === 'bebida') {
              updatedBebidas = updatedBebidas.map(b =>
                b.id === item.itemId ? { ...b, stock: Math.max(0, b.stock - item.cantidad) } : b
              )
            } else if (item.tipo === 'almuerzo') {
              updatedAlmuerzo = { ...updatedAlmuerzo, stock: Math.max(0, updatedAlmuerzo.stock - item.cantidad) }
            }
          })
        }
      }

      const delivered = updatedOrders.filter(o => o.status === 'entregado')
      const ventasTotales = delivered.reduce((s, o) => s + o.total, 0)
      const cantidadPedidos = delivered.length
      const ticketPromedio = cantidadPedidos ? Math.round(ventasTotales / cantidadPedidos) : 0

      // Category breakdown
      const porCategoria = delivered.reduce((acc, o) => {
        o.items.forEach(item => {
          acc[item.tipo] = (acc[item.tipo] || 0) + item.subtotal
        })
        return acc
      }, { almuerzo: 0, wok: 0, bebida: 0 })

      return {
        ...state,
        orders: updatedOrders,
        wokConfig: updatedWokConfig,
        bebidas: updatedBebidas,
        almuerzoEjecutivo: updatedAlmuerzo,
        analytics: { ventasTotales, cantidadPedidos, ticketPromedio, porCategoria },
      }
    }

    case 'UPDATE_CONFIG':
      // We could also push config to cloud here if needed
      return { ...state, config: { ...state.config, ...action.changes } }

    case 'UPDATE_WOK_CONFIG':
      return {
        ...state,
        wokConfig: {
          ...state.wokConfig,
          [action.category]: state.wokConfig[action.category].map(item =>
            item.id === action.id ? { ...item, ...action.changes } : item
          )
        }
      }

    case 'ADD_WOK_OPTION':
      return {
        ...state,
        wokConfig: {
          ...state.wokConfig,
          [action.category]: [...state.wokConfig[action.category], action.item]
        }
      }

    case 'DELETE_WOK_OPTION':
      return {
        ...state,
        wokConfig: {
          ...state.wokConfig,
          [action.category]: state.wokConfig[action.category].filter(i => i.id !== action.id)
        }
      }

    case 'UPDATE_BEBIDA':
      return {
        ...state,
        bebidas: state.bebidas.map(b =>
          b.id === action.id ? { ...b, ...action.changes } : b
        ),
      }

    case 'UPDATE_ALMUERZO':
      return { ...state, almuerzoEjecutivo: { ...state.almuerzoEjecutivo, ...action.changes } }

    case 'ADD_GASTO':
      return { ...state, gastos: [action.gasto, ...state.gastos] }

    case 'DELETE_GASTO':
      return { ...state, gastos: state.gastos.filter(g => g.id !== action.id) }

    case 'UPDATE_PINS':
      return { ...state, pins: { ...state.pins, ...action.changes } }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const saved = loadState()
  const [state, dispatch] = useReducer(reducer, saved || {
    ...initialData,
    analytics: { ventasTotales: 0, cantidadPedidos: 0, ticketPromedio: 0, porCategoria: { almuerzo: 0, wok: 0, bebida: 0 } },
  })

  // Persistence
  useEffect(() => { saveState(state) }, [state])

  // Real-time Sync with Firebase
  useEffect(() => {
    const unsubOrders = listenOrders((orders) => {
      dispatch({ type: 'SYNC_CLOUD_ORDERS', orders });
    });
    const unsubConfig = syncConfig((config) => {
      dispatch({ type: 'SYNC_CLOUD_CONFIG', config });
    });

    return () => { unsubOrders(); unsubConfig(); };
  }, [])

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
