import { useMemo, useState } from 'react'

type Role = 'admin' | 'cajero'
type UserItem = { id: string; email: string; role: Role; created_at: string; status?: 'Activo' | 'Suspendido' }
type SortDir = 'asc' | 'desc'

function RoleBadge({ role }: { role: Role }) {
  const bg = role === 'admin' ? 'var(--um-secondary)' : 'var(--um-success)'
  const color = '#fff'
  return (
    <span style={{ display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: 999, background: bg, color, fontWeight: 700, fontSize: '0.85rem' }}>{role}</span>
  )
}

function SearchBar({ search, roleFilter, sortDir, onSearch, onRoleFilter, onSortDir, onAdd }: { search: string; roleFilter: '' | Role; sortDir: SortDir; onSearch: (v: string) => void; onRoleFilter: (v: '' | Role) => void; onSortDir: (v: SortDir) => void; onAdd: () => void }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem 1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Gestión de usuarios</h2>
        <button className="um-btn-primary" onClick={onAdd} style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Crear usuario</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input className="um-input" placeholder="Buscar por email" value={search} onChange={(e) => onSearch(e.target.value)} aria-label="Buscar por email" style={{ flex: 1, minWidth: 280, height: '2.2rem', background: 'var(--um-surface)' }} />
        <select className="um-select" value={roleFilter} onChange={(e) => onRoleFilter(e.target.value as '' | Role)} aria-label="Filtrar por rol" style={{ height: '2.2rem', width: 180, flex: '0 0 180px' }}>
          <option value="">Todos</option>
          <option value="admin">Admin</option>
          <option value="cajero">Cajero</option>
        </select>
        <select className="um-select" value={sortDir} onChange={(e) => onSortDir(e.target.value as SortDir)} aria-label="Ordenar por fecha" style={{ height: '2.2rem', width: 180, flex: '0 0 180px' }}>
          <option value="desc">Recientes primero</option>
          <option value="asc">Antiguos primero</option>
        </select>
      </div>
    </div>
  )
}

function UserRow({ u, onEdit, onDelete }: { u: UserItem; onEdit: (u: UserItem) => void; onDelete: (u: UserItem) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
      <div><RoleBadge role={u.role} /></div>
      <div>{new Date(u.created_at).toLocaleString()}</div>
      <div style={{ color: u.status === 'Suspendido' ? 'var(--um-primary)' : 'var(--um-success)', fontWeight: 700 }}>{u.status || 'Activo'}</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="um-btn-secondary" onClick={() => onEdit(u)} style={{ padding: '0.4rem 0.7rem' }}>Editar</button>
        <button className="um-btn-danger" onClick={() => onDelete(u)} style={{ padding: '0.4rem 0.7rem', background: 'var(--um-primary)', color: 'var(--um-surface)' }}>Eliminar</button>
      </div>
    </div>
  )
}

function UsersTable({ users, onEdit, onDelete }: { users: UserItem[]; onEdit: (u: UserItem) => void; onDelete: (u: UserItem) => void }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700 }}>
        <div>Email</div>
        <div>Rol</div>
        <div>Fecha de creación</div>
        <div>Estado</div>
        <div style={{ textAlign: 'right' }}>Acciones</div>
      </div>
      <div>
        {users.map((u) => (
          <UserRow key={u.id} u={u} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  )
}

function UserFormModal({ initial, onCancel, onSave }: { initial?: Partial<UserItem>; onCancel: () => void; onSave: (u: Omit<UserItem, 'id' | 'created_at' | 'status'> & { password?: string }) => void }) {
  const [email, setEmail] = useState(initial?.email ?? '')
  const [role, setRole] = useState<Role>((initial?.role as Role) ?? 'cajero')
  const [password, setPassword] = useState('')
  const [changePassword, setChangePassword] = useState(false)
  const [error, setError] = useState('')
  const isEdit = !!initial?.id
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const em = email.trim()
    const validEmail = /.+@.+\..+/.test(em)
    if (!validEmail) { setError('Email inválido'); return }
    if (!role) { setError('Rol obligatorio'); return }
    if (!isEdit) {
      if (password.length < 6) { setError('Password mínimo 6 caracteres'); return }
    } else if (changePassword && password.length > 0 && password.length < 6) { setError('Password mínimo 6 caracteres'); return }
    setError('')
    const payload: Omit<UserItem, 'id' | 'created_at' | 'status'> & { password?: string } = { email: em, role }
    if (!isEdit || changePassword) payload.password = password
    onSave(payload)
  }
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div role="dialog" aria-modal="true" aria-label={isEdit ? 'Editar usuario' : 'Crear usuario'} style={{ width: 'min(560px, 92vw)', border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
        <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--um-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{isEdit ? 'Editar usuario' : 'Crear usuario'}</h3>
          <button className="um-btn-secondary" onClick={onCancel} style={{ padding: '0.4rem 0.7rem' }}>Cerrar</button>
        </div>
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', alignItems: 'center', gap: '0.75rem' }}>
            <input className="um-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" style={{ width: '100%', height: '2.2rem', background: 'var(--um-surface)', boxSizing: 'border-box' }} />
            <select className="um-select" value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Rol" style={{ height: '2.2rem' }}>
              <option value="admin">Admin</option>
              <option value="cajero">Cajero</option>
            </select>
          </div>
          {!isEdit ? (
            <input className="um-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" style={{ width: '100%', height: '2.2rem', background: 'var(--um-surface)', boxSizing: 'border-box' }} />
          ) : (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={changePassword} onChange={(e) => setChangePassword(e.target.checked)} aria-label="Cambiar contraseña" />
                <span>Resetear contraseña</span>
              </label>
              {changePassword && (
                <input className="um-input" type="password" placeholder="Nuevo password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Nuevo password" style={{ width: '100%', height: '2.2rem', background: 'var(--um-surface)', boxSizing: 'border-box' }} />
              )}
            </div>
          )}
          {error && <div className="um-error" style={{ color: 'var(--um-primary)', fontWeight: 700 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="um-btn-secondary" type="button" onClick={onCancel} style={{ padding: '0.5rem 0.9rem' }}>{isEdit ? 'Cancelar' : 'Cancelar'}</button>
            <button className="um-btn-primary" type="submit" style={{ padding: '0.5rem 0.9rem', fontWeight: 700 }}>{isEdit ? 'Guardar cambios' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ email, onCancel, onConfirm }: { email: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div role="dialog" aria-modal="true" aria-label="Confirmar eliminación" style={{ width: 'min(520px, 92vw)', border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Confirmar eliminación</h3>
        <p style={{ margin: '0.5rem 0', color: 'var(--um-text)' }}>¿Eliminar usuario {email}? Esta acción es permanente.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button className="um-btn-secondary" onClick={onCancel} style={{ padding: '0.5rem 0.9rem' }}>Cancelar</button>
          <button className="um-btn-danger" onClick={onConfirm} style={{ padding: '0.5rem 0.9rem', background: 'var(--um-primary)', color: 'var(--um-surface)', fontWeight: 700 }}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminUsuarios() {
  const [users, setUsers] = useState<UserItem[]>([
    { id: 'u-1', email: 'admin@urbanmarket.com', role: 'admin', created_at: '2025-01-12T10:00:00.000Z', status: 'Activo' },
    { id: 'u-2', email: 'cajero1@urbanmarket.com', role: 'cajero', created_at: '2025-01-13T09:30:00.000Z', status: 'Activo' },
    { id: 'u-3', email: 'cajero2@urbanmarket.com', role: 'cajero', created_at: '2025-01-14T08:45:00.000Z', status: 'Activo' },
  ])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'' | Role>('')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<UserItem | null>(null)
  const [deleting, setDeleting] = useState<UserItem | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let arr = users.slice()
    const q = search.trim().toLowerCase()
    if (q) arr = arr.filter((u) => u.email.toLowerCase().includes(q))
    if (roleFilter) arr = arr.filter((u) => u.role === roleFilter)
    arr.sort((a, b) => {
      const ta = new Date(a.created_at).getTime()
      const tb = new Date(b.created_at).getTime()
      return sortDir === 'asc' ? ta - tb : tb - ta
    })
    return arr
  }, [users, search, roleFilter, sortDir])

  function openCreate() { setEditing(null); setShowForm(true) }
  function openEdit(u: UserItem) { setEditing(u); setShowForm(true) }
  function closeForm() { setShowForm(false) }
  function saveUser(data: Omit<UserItem, 'id' | 'created_at' | 'status'> & { password?: string }) {
    if (editing) {
      setUsers((us) => us.map((u) => u.id === editing.id ? { ...u, email: data.email, role: data.role } : u))
      setFeedback('Usuario actualizado')
    } else {
      const id = globalThis.crypto?.randomUUID?.() ?? `u-${Date.now()}`
      setUsers((us) => [{ id, email: data.email, role: data.role, created_at: new Date().toISOString(), status: 'Activo' }, ...us])
      setFeedback('Usuario creado')
    }
    setShowForm(false)
    setTimeout(() => setFeedback(null), 2500)
  }
  function confirmDelete() {
    if (!deleting) return
    setUsers((us) => us.filter((u) => u.id !== deleting.id))
    setDeleting(null)
    setFeedback('Usuario eliminado')
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <div className="um-step um-step-in" style={{ display: 'grid', gap: '1rem' }}>
      <SearchBar search={search} roleFilter={roleFilter} sortDir={sortDir} onSearch={setSearch} onRoleFilter={setRoleFilter} onSortDir={setSortDir} onAdd={openCreate} />

      {feedback && (
        <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', color: 'var(--um-success)', fontWeight: 700, padding: '0.6rem 1rem' }}>{feedback}</div>
      )}

      <UsersTable users={filtered} onEdit={openEdit} onDelete={(u) => setDeleting(u)} />

      {showForm && (
        <UserFormModal initial={editing ?? undefined} onCancel={closeForm} onSave={saveUser} />
      )}

      {deleting && (
        <DeleteConfirmModal email={deleting.email} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />
      )}

      <div style={{ display: 'grid', gap: '0.5rem', opacity: 0.85 }}>
        <small style={{ color: 'var(--um-text)' }}>Para conectarse a Supabase, reemplazar el estado local por llamadas al backend que creen, lean, actualicen y eliminen usuarios y sincronicen con Auth para la gestión de contraseñas.</small>
      </div>
    </div>
  )
}
