// ─── Datos semilla del restaurante ────────────────────────────────────────
export const initialData = {
  // ── Almuerzo Ejecutivo ──
  almuerzoEjecutivo: {
    proteina: 'Pollo a la Plancha',
    acompanamiento: 'Arroz, ensalada y sopa del día',
    precio: 16000,
    stock: 20,
    activo: true,
  },

  // ── Configuración Wok Gourmet (Tipo Buffet) ──
  wokConfig: {
    bases: [
      { id: 'base-1', nombre: 'Arroz Wok', emoji: '🍚', precioBase: 5000, activo: true },
      { id: 'base-2', nombre: 'Tallarines', emoji: '🍜', precioBase: 6000, activo: true },
    ],
    proteinas: [
      { id: 'prot-1', nombre: 'Pollo', emoji: '🍗', precioPorcion: 6000, stock: 40, activo: true },
      { id: 'prot-2', nombre: 'Cerdo', emoji: '🐷', precioPorcion: 7000, stock: 30, activo: true },
      { id: 'prot-3', nombre: 'Res', emoji: '🥩', precioPorcion: 8000, stock: 25, activo: true },
      { id: 'prot-4', nombre: 'Camarón', emoji: '🍤', precioPorcion: 12000, stock: 15, activo: true },
    ],
    extras: [
      { id: 'ext-1', nombre: 'Plátano Maduro', emoji: '🍌', precio: 2500, stock: 50, activo: true },
      { id: 'ext-2', nombre: 'Patacona', emoji: '🍘', precio: 3000, stock: 40, activo: true },
      { id: 'ext-3', nombre: 'Huevo frito', emoji: '🍳', precio: 2000, stock: 60, activo: true },
      { id: 'ext-4', nombre: 'Chorizo', emoji: '🌭', precio: 4500, stock: 20, activo: true },
      { id: 'ext-5', nombre: 'Verduras Extra', emoji: '🥦', precio: 2000, stock: 30, activo: true },
    ]
  },

  // ── Bebidas ──
  bebidas: [
    { id: 'b1', nombre: 'Limonada Natural',   emoji: '🍋', precio: 5000,  stock: 30, activo: true  },
    { id: 'b2', nombre: 'Jugo de Maracuyá',   emoji: '🥭', precio: 5500,  stock: 20, activo: true  },
    { id: 'b3', nombre: 'Agua Mineral',        emoji: '💧', precio: 3000,  stock: 40, activo: true  },
    { id: 'b4', nombre: 'Gaseosa Personal',   emoji: '🥤', precio: 3500,  stock: 35, activo: true  },
    { id: 'b5', nombre: 'Té Frío Durazno',    emoji: '🍑', precio: 4500,  stock: 15, activo: true  },
    { id: 'b6', nombre: 'Jugo de Lulo',       emoji: '🟠', precio: 5000,  stock: 18, activo: true  },
  ],

  orders: [],
  cart: [],
  pins: { cajero: '1234', admin: '9999' },
  gastos: [],
  config: {
    ubicacion: 'Calle Principal - Frente al Parque',
    estado: 'Abierto', // Abierto, Cerrado, Agotado
  },
  analytics: { 
    ventasTotales: 0, 
    cantidadPedidos: 0, 
    ticketPromedio: 0,
    porCategoria: { almuerzo: 0, wok: 0, bebida: 0 }
  }
}
