// ─── Stock Badge ──────────────────────────────────────────────────────────
export function StockBadge({ stock, threshold = 5 }) {
  if (stock === 0)  return <span className="badge-gray">Agotado</span>
  if (stock <= threshold) return <span className="badge-red">⚠ {stock} uds</span>
  if (stock <= threshold * 3) return <span className="badge-yellow">{stock} uds</span>
  return <span className="badge-green">{stock} uds</span>
}
