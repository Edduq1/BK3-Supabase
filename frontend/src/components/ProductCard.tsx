import type { Product } from '../types'

type Props = { p: Product; qty: number; onAdd: (p: Product) => void; onInc: (id: string) => void; onDec: (id: string) => void }
export default function ProductCard({ p, qty, onAdd, onInc, onDec }: Props) {
  return (
    <div className="um-card">
      <div className="um-card-media">
        <img src={p.image} alt={p.name} loading="lazy" width={320} height={240} sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" />
      </div>
      <div className="um-card-body">
        <div className="um-card-title">{p.name}</div>
        <div className="um-card-price">S/ {p.price.toFixed(2)}</div>
        {qty < 1 ? (
          <button className="um-card-btn" onClick={() => onAdd(p)}>Agregar</button>
        ) : (
          <div className="um-qty">
            <button className="um-qty-btn" onClick={() => onDec(p.id)} disabled={qty <= 1}>−</button>
            <span className="um-qty-value" aria-live="polite">{qty}</span>
            <button className="um-qty-btn" onClick={() => onInc(p.id)} disabled={qty >= p.stock}>+</button>
          </div>
        )}
      </div>
    </div>
  )
}