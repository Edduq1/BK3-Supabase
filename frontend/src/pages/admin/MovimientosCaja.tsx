import { useMemo, useState } from 'react'

type MovementType = 'apertura' | 'ingreso' | 'salida' | 'cierre'
type CashMovement = { id: string; type: MovementType; amount: number; description: string; datetime: string; balance_after: number; cashier_id: string }
type UserItem = { id: string; name: string; email: string }

type SortKey = 'date' | 'type' | 'amount'
type SortDir = 'asc' | 'desc'

function FiltersBar({ type, cashier, from, to, query, onType, onCashier, onFrom, onTo, onQuery, onReset, onExport, users }: {
  type: MovementType | 'todos'
  cashier: string
  from: string
  to: string
  query: string
  onType: (v: MovementType | 'todos') => void
  onCashier: (v: string) => void
  onFrom: (v: string) => void
  onTo: (v: string) => void
  onQuery: (v: string) => void
  onReset: () => void
  onExport: () => void
  users: UserItem[]
}) {
  return (
    <div className="um-toolbar">
      <div className="um-toolbar-search">
        <input className="um-input" placeholder="Buscar por descripción o ticket" value={query} onChange={(e) => onQuery(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto auto', gap: '0.5rem', alignItems: 'center' }}>
        <select className="um-input" value={type} onChange={(e) => onType(e.target.value as MovementType | 'todos')} style={{ height: '2.4rem', padding: '0 0.75rem' }}>
          <option value="todos">Todos</option>
          <option value="apertura">Apertura</option>
          <option value="ingreso">Ingreso</option>
          <option value="salida">Salida</option>
          <option value="cierre">Cierre</option>
        </select>
        <select className="um-input" value={cashier} onChange={(e) => onCashier(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem' }}>
          <option value="">Todos los cajeros</option>
          {users.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
        </select>
        <input className="um-input" type="date" value={from} onChange={(e) => onFrom(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <input className="um-input" type="date" value={to} onChange={(e) => onTo(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <button className="um-btn-secondary" onClick={onReset} style={{ height: '2.4rem', padding: '0 0.9rem' }}>Limpiar</button>
        <button className="um-btn-secondary" onClick={onExport} style={{ height: '2.4rem', padding: '0 0.9rem' }}>Exportar movimientos</button>
      </div>
    </div>
  )
}

function MovRow({ m, user }: { m: CashMovement; user: UserItem | undefined }) {
  const dt = new Date(m.datetime)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = String(dt.getFullYear())
  const HH = String(dt.getHours()).padStart(2, '0')
  const MM = String(dt.getMinutes()).padStart(2, '0')
  const SS = String(dt.getSeconds()).padStart(2, '0')
  const fdate = `${dd}/${mm}/${yyyy} ${HH}:${MM}:${SS}`
  const color = m.type === 'ingreso' ? 'var(--um-success)' : m.type === 'salida' ? '#e53935' : 'var(--um-text)'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr 0.8fr 2fr 1fr', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
      <div>{fdate}</div>
      <div>{user ? user.name : '-'}</div>
      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 999, border: '1px solid var(--um-border)', background: 'var(--um-surface)' }}>{m.type}</span>
      </div>
      <div style={{ fontWeight: 700, color }}>{`S/ ${m.amount.toFixed(2)}`}</div>
      <div>{m.description}</div>
      <div style={{ fontWeight: 700 }}>{`S/ ${m.balance_after.toFixed(2)}`}</div>
    </div>
  )
}

function MovTable({ rows, usersById, sortKey, sortDir, onSort }: { rows: CashMovement[]; usersById: Record<string, UserItem>; sortKey: SortKey; sortDir: SortDir; onSort: (k: SortKey) => void }) {
  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      if (sortKey === 'date') {
        const av = new Date(a.datetime).getTime()
        const bv = new Date(b.datetime).getTime()
        return sortDir === 'asc' ? av - bv : bv - av
      }
      if (sortKey === 'type') {
        const av = a.type.localeCompare(b.type)
        return sortDir === 'asc' ? av : -av
      }
      if (sortKey === 'amount') {
        return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })
    return list
  }, [rows, sortKey, sortDir])

  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr 0.8fr 2fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700, background: 'var(--um-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Fecha y hora</span>
          <button className="um-btn-secondary" onClick={() => onSort('date')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div>Cajero</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Tipo</span>
          <button className="um-btn-secondary" onClick={() => onSort('type')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Monto (S/)</span>
          <button className="um-btn-secondary" onClick={() => onSort('amount')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div>Descripción</div>
        <div>Saldo resultante</div>
      </div>
      <div>
        {sorted.map((m) => (
          <MovRow key={m.id} m={m} user={usersById[m.cashier_id]} />
        ))}
      </div>
    </div>
  )
}

export default function AdminMovimientosCaja() {
  const [users] = useState<UserItem[]>([
    { id: 'u1', name: 'Ana Torres', email: 'ana@um.com' },
    { id: 'u2', name: 'Luis Pérez', email: 'luis@um.com' },
    { id: 'u3', name: 'María Gómez', email: 'maria@um.com' },
  ])
  const [movs] = useState<CashMovement[]>([
    { id: 'm1', type: 'apertura', amount: 0, description: 'Apertura de caja turno mañana', datetime: '2025-01-14T08:00:00.000Z', balance_after: 0, cashier_id: 'u1' },
    { id: 'm2', type: 'ingreso', amount: 120.00, description: '#000124 Venta', datetime: '2025-01-16T13:05:00.000Z', balance_after: 120.00, cashier_id: 'u3' },
    { id: 'm3', type: 'ingreso', amount: 23.90, description: '#000123 Venta', datetime: '2025-01-15T16:42:00.000Z', balance_after: 143.90, cashier_id: 'u3' },
    { id: 'm4', type: 'salida', amount: 20.00, description: 'Compra de insumos', datetime: '2025-01-15T17:10:00.000Z', balance_after: 123.90, cashier_id: 'u2' },
    { id: 'm5', type: 'ingreso', amount: 80.10, description: '#000122 Venta', datetime: '2025-01-14T11:10:00.000Z', balance_after: 80.10, cashier_id: 'u2' },
    { id: 'm6', type: 'ingreso', amount: 45.60, description: '#000121 Venta', datetime: '2025-01-14T09:35:00.000Z', balance_after: 45.60, cashier_id: 'u1' },
    { id: 'm7', type: 'cierre', amount: 0, description: 'Cierre de caja turno tarde', datetime: '2025-01-16T22:00:00.000Z', balance_after: 123.90, cashier_id: 'u3' },
  ])

  const usersById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users])

  const [qType, setQType] = useState<MovementType | 'todos'>('todos')
  const [qCashier, setQCashier] = useState('')
  const [qFrom, setQFrom] = useState('')
  const [qTo, setQTo] = useState('')
  const [qQuery, setQQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    return movs.filter((m) => {
      const byType = qType === 'todos' ? true : m.type === qType
      const byCashier = qCashier ? m.cashier_id === qCashier : true
      const d = new Date(m.datetime)
      const byFrom = qFrom ? d.toISOString().slice(0,10) >= qFrom : true
      const byTo = qTo ? d.toISOString().slice(0,10) <= qTo : true
      const q = qQuery.trim().toLowerCase()
      const byQuery = q ? m.description.toLowerCase().includes(q) : true
      return byType && byCashier && byFrom && byTo && byQuery
    })
  }, [movs, qType, qCashier, qFrom, qTo, qQuery])

  const [page, setPage] = useState(1)
  const pageSize = 20
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  function onSort(k: SortKey) {
    if (sortKey === k) setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('asc') }
  }

  function onReset() {
    setQType('todos'); setQCashier(''); setQFrom(''); setQTo(''); setQQuery('')
  }

  function onExport() {
    const header = ['fecha_hora','cajero','tipo','monto','descripcion','saldo_resultante']
    const rows = filtered.map((m) => {
      const u = usersById[m.cashier_id]
      return [new Date(m.datetime).toISOString(), u ? u.name : '', m.type, m.amount.toFixed(2), m.description.replace(/\n/g,' '), m.balance_after.toFixed(2)]
    })
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'movimientos_caja.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <section className="um-home">
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <h2>Movimientos de caja</h2>
          <p>Aperturas, ingresos, salidas y cierres.</p>
        </div>
        <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem' }}>
          <FiltersBar type={qType} cashier={qCashier} from={qFrom} to={qTo} query={qQuery} onType={setQType} onCashier={setQCashier} onFrom={setQFrom} onTo={setQTo} onQuery={setQQuery} onReset={onReset} onExport={onExport} users={users} />
        </div>
        <MovTable rows={pageRows} usersById={usersById} sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Mostrando {pageRows.length} de {filtered.length} registros</div>
          <div style={{ display: 'inline-flex', gap: 8 }}>
            <button className="um-btn-secondary" onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}>Anterior</button>
            <div style={{ alignSelf: 'center' }}>Página {page} de {totalPages}</div>
            <button className="um-btn-secondary" onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page === totalPages}>Siguiente</button>
          </div>
        </div>
      </div>
    </section>
  )
}
