import { useRef, useState } from 'react'
import type { Product } from '../types'
import TrashIcon from '../assets/iconos/papelera.png'

type Props = {
  items: { id: string; qty: number }[]
  productsById: Record<string, Product>
  open: boolean
  onClose: () => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (id: string, qty: number) => void
  onCheckout: () => void
}

export default function CartModal({ items, productsById, open, onClose, onInc, onDec, onRemove, onRestore, onCheckout }: Props) {
  const total = items.reduce((sum, it) => {
    const p = productsById[it.id]
    return sum + (p ? p.price * it.qty : 0)
  }, 0)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [undo, setUndo] = useState<{ id: string; qty: number } | null>(null)
  const undoTimer = useRef<number | null>(null)

  function focusRow(id: string) {
    const el = document.getElementById(`um-row-${id}`)
    if (el) {
      el.classList.add('um-highlight')
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
      window.setTimeout(() => el.classList.remove('um-highlight'), 800)
    }
  }

  function handleRemove(id: string, qty: number) {
    onRemove(id)
    setUndo({ id, qty })
    if (undoTimer.current) window.clearTimeout(undoTimer.current)
    undoTimer.current = window.setTimeout(() => setUndo(null), 5000)
  }


  return (
    <>
      <div className={open ? 'um-overlay open' : 'um-overlay'} onClick={onClose} />
      <aside className={open ? 'um-drawer open' : 'um-drawer'} aria-modal={open} role="dialog">
        <div className="um-drawer-header">
          <button className="um-drawer-close" aria-label="Cerrar" onClick={onClose}>×</button>
          <div className="um-drawer-title">Carrito</div>
          <div className="um-drawer-sub">Tienes {items.reduce((a,b)=>a+b.qty,0)} items</div>
        </div>
        <div className="um-cart-list" ref={listRef}>
          {items.map((it) => {
            const p = productsById[it.id]
            if (!p) return null
            const rowTotal = p.price * it.qty
            return (
              <div className="um-cart-row" key={it.id} id={`um-row-${it.id}`}>
                <div className="um-cart-media"><img src={p.image} alt={p.name} loading="lazy" /></div>
                <div className="um-cart-info">
                  <div className="um-cart-name">{p.name}</div>
                  <div className="um-cart-meta">
                    <button className="um-remove-btn" aria-label="Eliminar" onClick={() => handleRemove(p.id, it.qty)}>
                      <img src={TrashIcon} alt="" aria-hidden="true" />
                    </button>
                    <div className="um-qty">
                      <button className="um-qty-btn" aria-label="Disminuir" onClick={() => { onDec(p.id); focusRow(p.id) }} disabled={it.qty <= 1}>−</button>
                      <span className="um-qty-value">{it.qty}</span>
                      <button className="um-qty-btn" aria-label="Aumentar" onClick={() => { onInc(p.id); focusRow(p.id) }} disabled={it.qty >= p.stock}>+</button>
                    </div>
                    <div className="um-cart-prices">
                      <span className="um-unit">S/ {p.price.toFixed(2)}</span>
                      <span className="um-row-total">S/ {rowTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="um-drawer-summary">
          <div className="um-drawer-summary-row"><span>Total</span><span>S/ {total.toFixed(2)}</span></div>
        </div>
        <div className="um-drawer-actions">
          <button className="um-btn-primary" onClick={onCheckout}>Finalizar compra</button>
        </div>
        {open && undo && (
          <div className="um-snackbar" role="status" aria-live="polite">
            <span>Producto eliminado</span>
            <button className="um-snackbar-btn" onClick={() => { onRestore(undo.id, undo.qty); setUndo(null); if (undoTimer.current) window.clearTimeout(undoTimer.current) }}>Deshacer</button>
          </div>
        )}
      </aside>
    </>
  )
}
