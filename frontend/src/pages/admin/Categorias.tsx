import { useMemo, useState } from 'react'

type Category = { id: number; name: string }

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem 1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Gestión de categorías</h2>
        <button className="um-btn-primary" onClick={() => onChange('__open__')} style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Agregar categoría</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
        <input className="um-input" placeholder="Buscar categoría" value={value === '__open__' ? '' : value} onChange={(e) => onChange(e.target.value)} aria-label="Buscar categoría" style={{ width: '100%', maxWidth: 520, height: '2.2rem' }} />
      </div>
    </div>
  )
}

function CategoryRow({ c, count, onEdit, onDelete }: { c: Category; count: number; onEdit: (c: Category) => void; onDelete: (c: Category) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 2fr 1fr 1fr', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
      <div style={{ fontWeight: 600 }}>{c.id}</div>
      <div style={{ fontWeight: 600 }}>{c.name}</div>
      <div style={{ fontWeight: 700, color: 'var(--um-secondary)' }}>{count}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="um-btn-secondary" onClick={() => onEdit(c)} style={{ padding: '0.4rem 0.7rem' }}>Editar</button>
        <button className="um-btn-danger" onClick={() => onDelete(c)} style={{ padding: '0.4rem 0.7rem', background: 'var(--um-primary)', color: 'var(--um-surface)' }}>Eliminar</button>
      </div>
    </div>
  )
}

function CategoriesTable({ categories, counts, onEdit, onDelete }: { categories: Category[]; counts: Record<number, number>; onEdit: (c: Category) => void; onDelete: (c: Category) => void }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 2fr 1fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700 }}>
        <div>ID</div>
        <div>Nombre de categoría</div>
        <div>Cantidad de productos</div>
        <div style={{ textAlign: 'right' }}>Acciones</div>
      </div>
      <div>
        {categories.map((c) => (
          <CategoryRow key={c.id} c={c} count={counts[c.id] || 0} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function CategoryForm({ initial, existingNames, onCancel, onSave }: { initial?: Partial<Category>; existingNames: string[]; onCancel: () => void; onSave: (c: Omit<Category, 'id'>) => void }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [error, setError] = useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) { setError('Nombre obligatorio'); return }
    const exists = existingNames.some((x) => x.toLowerCase() === n.toLowerCase())
    if (exists && n.toLowerCase() !== (initial?.name || '').toLowerCase()) { setError('La categoría ya existe'); return }
    setError('')
    onSave({ name: n })
  }
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div role="dialog" aria-modal="true" aria-label={initial?.id ? 'Editar categoría' : 'Nueva categoría'} style={{ width: 'min(560px, 92vw)', border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
        <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--um-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{initial?.id ? 'Editar categoría' : 'Nueva categoría'}</h3>
          <button className="um-btn-secondary" onClick={onCancel} style={{ padding: '0.4rem 0.7rem' }}>Cerrar</button>
        </div>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
          <input className="um-input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} aria-label="Nombre de la categoría" style={{ width: '100%', maxWidth: 420, height: '2.2rem' }} />
          {error && <div className="um-error" style={{ color: 'var(--um-primary)', fontWeight: 700 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="um-btn-secondary" type="button" onClick={onCancel} style={{ padding: '0.5rem 0.9rem' }}>Cancelar</button>
            <button className="um-btn-primary" type="submit" style={{ padding: '0.5rem 0.9rem', fontWeight: 700 }}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ name, onCancel, onConfirm }: { name: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div role="dialog" aria-modal="true" aria-label="Confirmar eliminación" style={{ width: 'min(520px, 92vw)', border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Confirmar eliminación</h3>
        <p style={{ margin: '0.5rem 0', color: 'var(--um-text)' }}>¿Eliminar categoría “{name}”? Si tiene productos asociados, deberá reasignarlos antes.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button className="um-btn-secondary" onClick={onCancel} style={{ padding: '0.5rem 0.9rem' }}>Cancelar</button>
          <button className="um-btn-danger" onClick={onConfirm} style={{ padding: '0.5rem 0.9rem', background: 'var(--um-primary)', color: 'var(--um-surface)', fontWeight: 700 }}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Bebidas' },
    { id: 2, name: 'Snacks' },
    { id: 3, name: 'Abarrotes' },
    { id: 4, name: 'Limpieza' },
    { id: 5, name: 'Desayuno' },
  ])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const counts = useMemo(() => ({
    1: 12,
    2: 10,
    3: 11,
    4: 9,
    5: 10,
  } as Record<number, number>), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return categories.filter((c) => (q ? c.name.toLowerCase().includes(q) : true)).sort((a, b) => a.name.localeCompare(b.name))
  }, [categories, search])

  function openCreate() { setEditing(null); setShowForm(true) }
  function openEdit(c: Category) { setEditing(c); setShowForm(true) }
  function closeForm() { setShowForm(false) }
  function saveCategory(data: Omit<Category, 'id'>) {
    if (editing) {
      setCategories((cs) => cs.map((c) => c.id === editing.id ? { ...c, ...data } : c))
      setFeedback('Categoría actualizada')
    } else {
      const id = Math.max(0, ...categories.map((c) => c.id)) + 1
      setCategories((cs) => [{ id, ...data }, ...cs])
      setFeedback('Categoría creada')
    }
    setShowForm(false)
    setTimeout(() => setFeedback(null), 2500)
  }
  function confirmDelete() {
    if (!deleting) return
    setCategories((cs) => cs.filter((c) => c.id !== deleting.id))
    setDeleting(null)
    setFeedback('Categoría eliminada')
    setTimeout(() => setFeedback(null), 2500)
  }

  function onSearchChange(v: string) { if (v === '__open__') { openCreate(); return } setSearch(v) }

  return (
    <div className="um-step um-step-in" style={{ display: 'grid', gap: '1rem' }}>
      <SearchBar value={search} onChange={onSearchChange} />

      {feedback && (
        <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', color: 'var(--um-success)', fontWeight: 700, padding: '0.6rem 1rem' }}>{feedback}</div>
      )}

      <CategoriesTable categories={filtered} counts={counts} onEdit={openEdit} onDelete={(c) => setDeleting(c)} />

      {showForm && (
        <CategoryForm initial={editing ?? undefined} existingNames={categories.map((c) => c.name)} onCancel={closeForm} onSave={saveCategory} />
      )}

      {deleting && (
        <DeleteConfirmModal name={deleting.name} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}

      <div style={{ display: 'grid', gap: '0.5rem', opacity: 0.85 }}>
        <small style={{ color: 'var(--um-text)' }}>Para conectarse a Supabase, reemplazar el estado local por consultas al backend y llamadas a RPC o REST que lean y modifiquen la tabla categories.</small>
      </div>
    </div>
  )
}

