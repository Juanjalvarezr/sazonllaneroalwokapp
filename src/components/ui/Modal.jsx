import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className={`w-full ${sizes[size]} animate-zoom-in glass card relative`}
        style={{ borderRadius: '32px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.4rem', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
