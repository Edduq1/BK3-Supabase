import type { Product } from '../types'
import ProductCard from './ProductCard'

type Props = { products: Product[]; quantities: Record<string, number>; onAdd: (p: Product) => void; onInc: (id: string) => void; onDec: (id: string) => void }
export default function ProductGrid({ products, quantities, onAdd, onInc, onDec }: Props) {
  return (
    <section className="um-grid" aria-label="Productos">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} qty={quantities[p.id] || 0} onAdd={onAdd} onInc={onInc} onDec={onDec} />
      ))}
    </section>
  )
}