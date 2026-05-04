// ─── Utilidades de formato ─────────────────────────────────────────────────
export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(date)

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return ''
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) return 'Hace un momento'
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.floor(mins / 60)
  return `Hace ${hours} h`
}
