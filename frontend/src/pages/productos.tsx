import { useState } from 'react'
import Filters from '../components/Filters'
import ProductGrid from '../components/ProductGrid'
import type { Product } from '../types'

type Props = {
  products: Product[]
  categories: string[]
  selectedCategory: string
  onSelectCategory: (c: string) => void
  quantities: Record<string, number>
  onAdd: (p: Product) => void
  onInc: (id: string) => void
  onDec: (id: string) => void
}

export default function ProductosPage({ products, categories, selectedCategory, onSelectCategory, quantities, onAdd, onInc, onDec }: Props) {
  const pageSize = 12
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(products.length / pageSize))
  const start = (page - 1) * pageSize
  const current = products.slice(start, start + pageSize)
  return (
    <div className="um-step um-step-in">
      <div className="um-toolbar">
        <Filters categories={categories} selectedCategory={selectedCategory} onSelect={(c) => { setPage(1); onSelectCategory(c) }} />
      </div>
      <ProductGrid products={current} quantities={quantities} onAdd={onAdd} onInc={onInc} onDec={onDec} />
      {pages > 1 && (
        <div className="um-toolbar" style={{ justifyContent: 'center', gap: 8 }}>
          <button className="um-btn-secondary" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Anterior</button>
          <span>Página {page} de {pages}</span>
          <button className="um-btn-secondary" onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}>Siguiente</button>
        </div>
      )}
    </div>
  )
}
