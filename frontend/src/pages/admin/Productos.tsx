import { useMemo, useState } from 'react'

type Category = { id: string; name: string }
type Product = { id: string; name: string; price: number; category_id: string; image_url: string; created_at: string }

type SortKey = 'price' | 'date'
type SortDir = 'asc' | 'desc'



function priceFromName(name: string, categoryId: string) {
  const base: Record<string, number> = {
    'cat-bebidas': 10.5,
    'cat-limpieza': 18.9,
    'cat-desayuno': 12.4,
    'cat-snacks': 8.3,
    'cat-abarrotes': 7.2,
  }
  const b = base[categoryId] ?? 10
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  const cents = (sum % 100) / 100
  const val = b + cents
  return Number(val.toFixed(2))
}

function FiltersBar({
  search,
  onSearch,
  category,
  onCategory,
  minPrice,
  maxPrice,
  onMinPrice,
  onMaxPrice,
  sortKey,
  sortDir,
  onSortKey,
  onSortDir,
  categories,
  onAdd,
}: {
  search: string
  onSearch: (v: string) => void
  category: string
  onCategory: (v: string) => void
  minPrice: string
  maxPrice: string
  onMinPrice: (v: string) => void
  onMaxPrice: (v: string) => void
  sortKey: SortKey
  sortDir: SortDir
  onSortKey: (v: SortKey) => void
  onSortDir: (v: SortDir) => void
  categories: Category[]
  onAdd: () => void
}) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem 1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Gestión de productos</h2>
        <button className="um-btn-primary" onClick={onAdd} style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Agregar producto</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.9fr 0.9fr 0.9fr 0.9fr', gap: '0.75rem' }}>
        <input className="um-input" placeholder="Buscar por nombre" value={search} onChange={(e) => onSearch(e.target.value)} />
        <select className="um-select" value={category} onChange={(e) => onCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="um-input" type="number" min="0" step="0.01" placeholder="Precio mínimo" value={minPrice} onChange={(e) => onMinPrice(e.target.value)} />
        <input className="um-input" type="number" min="0" step="0.01" placeholder="Precio máximo" value={maxPrice} onChange={(e) => onMaxPrice(e.target.value)} />
        <select className="um-select" value={sortKey} onChange={(e) => onSortKey(e.target.value as SortKey)}>
          <option value="price">Ordenar por precio</option>
          <option value="date">Ordenar por fecha</option>
        </select>
        <select className="um-select" value={sortDir} onChange={(e) => onSortDir(e.target.value as SortDir)}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </div>
    </div>
  )
}

function ProductRow({ p, categoryName, onEdit, onDelete }: { p: Product; categoryName: string; onEdit: (p: Product) => void; onDelete: (p: Product) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 0.8fr 1fr 1fr 0.9fr', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
      <img src={p.image_url} alt="" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--um-border)' }} />
      <div style={{ fontWeight: 600 }}>{p.name}</div>
      <div style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {p.price.toFixed(2)}</div>
      <div>{categoryName}</div>
      <div>{new Date(p.created_at).toLocaleString()}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="um-btn-secondary" onClick={() => onEdit(p)} style={{ padding: '0.4rem 0.7rem' }}>Editar</button>
        <button className="um-btn-danger" onClick={() => onDelete(p)} style={{ padding: '0.4rem 0.7rem', background: 'var(--um-primary)', color: 'var(--um-surface)' }}>Eliminar</button>
      </div>
    </div>
  )
}

function ProductTable({ products, categories, onEdit, onDelete }: { products: Product[]; categories: Category[]; onEdit: (p: Product) => void; onDelete: (p: Product) => void }) {
  const categoryMap = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories])
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 0.8fr 1fr 1fr 0.9fr', gap: 12, padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>
        <span>Imagen</span>
        <span>Nombre</span>
        <span>Precio</span>
        <span>Categoría</span>
        <span>Fecha de creación</span>
        <span style={{ textAlign: 'right' }}>Acciones</span>
      </div>
      <div>
        {products.map((p) => (
          <ProductRow key={p.id} p={p} categoryName={categoryMap[p.category_id] ?? '—'} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function ProductForm({ initial, categories, onCancel, onSave }: { initial?: Partial<Product>; categories: Category[]; onCancel: () => void; onSave: (p: Omit<Product, 'id' | 'created_at'>) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? (categories[0]?.id ?? ''))
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || (!imageUrl.trim() && !file) || !categoryId) { setError('Completa todos los campos'); return }
    const num = Number(price)
    if (!Number.isFinite(num) || num <= 0) { setError('Precio inválido'); return }
    if (!categories.find((c) => c.id === categoryId)) { setError('Categoría inválida'); return }
    setError('')
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = String(reader.result)
        onSave({ name, price: num, category_id: categoryId, image_url: dataUrl })
      }
      reader.readAsDataURL(file)
    } else {
      onSave({ name, price: num, category_id: categoryId, image_url: imageUrl })
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) 260px', gap: '1rem', alignItems: 'start' }}>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <input className="um-input" placeholder="Nombre del producto" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="um-input" type="number" min="0" step="0.01" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select className="um-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <input className="um-input" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            if (!f) { setFile(null); return }
            setFile(f)
            const url = URL.createObjectURL(f)
            setImageUrl(url)
          }} />
          <small style={{ color: 'var(--um-text)', opacity: 0.8 }}>Formatos aceptados: PNG, JPG, JPEG, WEBP</small>
        </div>
        {error && <div className="um-error" style={{ color: 'var(--um-primary)', fontWeight: 700 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.25rem' }}>
          <button className="um-btn-secondary" type="button" onClick={onCancel} style={{ padding: '0.5rem 0.9rem' }}>Cancelar</button>
          <button className="um-btn-primary" type="submit" style={{ padding: '0.5rem 0.9rem', fontWeight: 700 }}>Guardar</button>
        </div>
      </div>
      <div style={{ display: 'grid', gap: '0.5rem', justifyItems: 'center' }}>
        {(imageUrl || initial?.image_url) && (
          <img src={imageUrl || (initial?.image_url ?? '')} alt="" style={{ width: 220, height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid var(--um-border)' }} />
        )}
      </div>
    </form>
  )
}

export default function AdminProductos() {
  const [categories] = useState<Category[]>([
    { id: 'cat-bebidas', name: 'Bebidas' },
    { id: 'cat-snacks', name: 'Snacks' },
    { id: 'cat-abarrotes', name: 'Abarrotes' },
    { id: 'cat-limpieza', name: 'Limpieza' },
    { id: 'cat-desayuno', name: 'Desayuno' },
  ])
  const initialProducts = useMemo(() => {
    const modules = import.meta.glob('../../assets/*.png', { eager: true }) as Record<string, { default: string }>
    const entries = Object.entries(modules)
    return entries.map(([path, mod], i) => {
      const file = path.split('/').pop() || ''
      const name = file.replace(/\.png$/i, '')
      const lc = name.toLowerCase()
      const cat = lc.match(/(agua|refresco|soda|jugo|vino|bebida|isotónica|espumante)/) ? 'cat-bebidas'
        : lc.match(/(detergente|ambientador|limpiador|jabón|lavavajillas|kit limpieza)/) ? 'cat-limpieza'
        : lc.match(/(yogurt|cereal|granola|leche|mermelada|pan|café|té)/) ? 'cat-desayuno'
        : lc.match(/(gomitas|papas|nachos|galletas|chocolate|caramelos|barra|semillas)/) ? 'cat-snacks'
        : 'cat-abarrotes'
      return { id: `p-${i+1}`, name, price: priceFromName(name, cat), category_id: cat, image_url: mod.default, created_at: new Date('2025-01-15T10:00:00.000Z').toISOString() }
    })
  }, [])
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    let data = products.slice()
    if (search.trim()) data = data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (filterCategory) data = data.filter((p) => p.category_id === filterCategory)
    const min = Number(minPrice); if (minPrice && Number.isFinite(min)) data = data.filter((p) => p.price >= min)
    const max = Number(maxPrice); if (maxPrice && Number.isFinite(max)) data = data.filter((p) => p.price <= max)
    data.sort((a, b) => {
      const valA = sortKey === 'price' ? a.price : new Date(a.created_at).getTime()
      const valB = sortKey === 'price' ? b.price : new Date(b.created_at).getTime()
      return sortDir === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0)
    })
    return data
  }, [products, search, filterCategory, minPrice, maxPrice, sortKey, sortDir])

  function openCreate() { setEditing(null); setShowForm(true) }
  function openEdit(p: Product) { setEditing(p); setShowForm(true) }
  function closeForm() { setShowForm(false) }
  function saveProduct(data: Omit<Product, 'id' | 'created_at'>) {
    if (editing) {
      setProducts((ps) => ps.map((p) => p.id === editing.id ? { ...p, ...data } : p))
    } else {
      const id = `p-${Date.now()}`
      setProducts((ps) => [{ id, created_at: new Date().toISOString(), ...data }, ...ps])
    }
    setShowForm(false)
  }
  function askDelete(p: Product) { setConfirmDelete(p) }
  function cancelDelete() { setConfirmDelete(null) }
  function confirmDeleteNow() { if (confirmDelete) { setProducts((ps) => ps.filter((p) => p.id !== confirmDelete.id)); setConfirmDelete(null) } }

  return (
    <section className="um-home" style={{ display: 'grid', gap: '1rem' }}>
      <FiltersBar
        search={search}
        onSearch={setSearch}
        category={filterCategory}
        onCategory={setFilterCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPrice={setMinPrice}
        onMaxPrice={setMaxPrice}
        sortKey={sortKey}
        sortDir={sortDir}
        onSortKey={setSortKey}
        onSortDir={setSortDir}
        categories={categories}
        onAdd={openCreate}
      />

      <ProductTable products={filtered} categories={categories} onEdit={openEdit} onDelete={askDelete} />

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', display: 'grid', placeItems: 'center', zIndex: 200 }}>
          <div style={{ width: 'min(560px, 92vw)', background: 'var(--um-surface)', border: '1px solid var(--um-border)', borderRadius: 12, boxShadow: 'var(--um-shadow)', padding: '1rem' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{editing ? 'Editar producto' : 'Crear producto'}</div>
            <ProductForm initial={editing ?? undefined} categories={categories} onCancel={closeForm} onSave={saveProduct} />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'grid', placeItems: 'center', zIndex: 210 }}>
          <div style={{ width: 'min(480px, 90vw)', background: 'var(--um-surface)', border: '1px solid var(--um-border)', borderRadius: 12, boxShadow: 'var(--um-shadow)', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
            <div style={{ fontWeight: 800 }}>¿Eliminar producto?</div>
            <div>Esta acción no se puede deshacer. Producto: <strong>{confirmDelete.name}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="um-btn-secondary" onClick={cancelDelete}>Cancelar</button>
              <button className="um-btn-danger" onClick={confirmDeleteNow} style={{ background: 'var(--um-primary)', color: 'var(--um-surface)' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

