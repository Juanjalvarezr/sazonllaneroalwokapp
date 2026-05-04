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
      { id: 'base-1', nombre: 'Arroz Blanco', emoji: '🍚', precioBase: 0, activo: true },
      { id: 'base-2', nombre: 'Arroz Wok (Negrito)', emoji: '🍱', precioBase: 2000, activo: true },
      { id: 'base-3', nombre: 'Fideos', emoji: '🍜', precioBase: 1000, activo: true },
    ],
    proteinas: [
      { id: 'prot-1', nombre: 'Res al Wok', emoji: '🥩', precioPorcion: 8000, stock: 40, activo: true, salsas: ['Natural', 'BBQ', 'Champiñones'] },
      { id: 'prot-2', nombre: 'Cerdo al Wok', emoji: '🐷', precioPorcion: 7000, stock: 30, activo: true, salsas: ['Natural', 'BBQ', 'Champiñones'] },
      { id: 'prot-3', nombre: 'Pollo a la Plancha', emoji: '🍗', precioPorcion: 6000, stock: 50, activo: true, salsas: ['Natural', 'BBQ', 'Champiñones'] },
    ],
    extras: [
      { id: 'ext-1', nombre: 'Plátano Maduro', emoji: '🍌', precio: 2500, stock: 50, activo: true },
      { id: 'ext-2', nombre: 'Pataconas', emoji: '🍘', precio: 3000, stock: 40, activo: true },
      { id: 'ext-3', nombre: 'Huevo frito', emoji: '🍳', precio: 2000, stock: 60, activo: true },
      { id: 'ext-4', nombre: 'Salchicha', emoji: '🌭', precio: 2500, stock: 40, activo: true },
      { id: 'ext-5', nombre: 'Aborrajado (Queso)', emoji: '🧀', precio: 4500, stock: 20, activo: true },
    ],
    principios: [
      { id: 'pri-1', nombre: 'Frijoles', emoji: '🫘', activo: true },
      { id: 'pri-2', nombre: 'Lentejas', emoji: '🥣', activo: true },
    ],
    ensaladas: [
      { id: 'ens-1', nombre: 'Ensalada Verde', emoji: '🥗', activo: true },
      { id: 'ens-2', nombre: 'Ensalada Roja', emoji: '🍅', activo: true },
      { id: 'ens-3', nombre: 'Sin Ensalada', emoji: '🚫', activo: true },
    ]
  },

  // ── Bebidas ──
  bebidas: [
    { id: 'b1', nombre: 'Jugo Natural', emoji: '🥤', precio: 5000, stock: 30, activo: true },
    { id: 'b2', nombre: 'Gaseosa', emoji: '🥤', precio: 4000, stock: 40, activo: true },
  ],

  orders: [],
  cart: [],
  pins: { cajero: '1234', admin: '9999' },
  gastos: [],
  config: {
    ubicacion: 'Calle Principal - Sazón Llanero al Wok',
    estado: 'Abierto', 
  },
  analytics: { 
    ventasTotales: 0, 
    cantidadPedidos: 0, 
    ticketPromedio: 0,
    porCategoria: { almuerzo: 0, wok: 0, bebida: 0 }
  }
}
