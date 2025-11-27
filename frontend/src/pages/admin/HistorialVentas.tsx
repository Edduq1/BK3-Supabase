import { useMemo, useState } from 'react'

type PaymentMethod = 'efectivo' | 'tarjeta' | 'yape'
type UserItem = { id: string; name: string; email: string }
type ProductItem = { id: string; name: string; category: string }
type SaleHeader = { ticket: string; created_at: string; cashier_id: string; payment_method: PaymentMethod; total: number }
type SaleDetail = { ticket: string; product_id: string; qty: number; unit_price: number }

type SortKey = 'date' | 'total'
type SortDir = 'asc' | 'desc'

function HistorySearchBar({ ticket, cashier, method, date, from, to, onTicket, onCashier, onMethod, onDate, onFrom, onTo }: {
  ticket: string
  cashier: string
  method: PaymentMethod | 'todos'
  date: string
  from: string
  to: string
  onTicket: (v: string) => void
  onCashier: (v: string) => void
  onMethod: (v: PaymentMethod | 'todos') => void
  onDate: (v: string) => void
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) {
  return (
    <div className="um-toolbar">
      <div className="um-toolbar-search">
        <input className="um-input" placeholder="#000123" value={ticket} onChange={(e) => onTicket(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
        <input className="um-input" placeholder="Cajero" value={cashier} onChange={(e) => onCashier(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <select className="um-input" value={method} onChange={(e) => onMethod(e.target.value as PaymentMethod | 'todos')} style={{ height: '2.4rem', padding: '0 0.75rem' }}>
          <option value="todos">Todos los métodos</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="yape">Yape</option>
        </select>
        <input className="um-input" type="date" value={date} onChange={(e) => onDate(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <input className="um-input" type="date" value={from} onChange={(e) => onFrom(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <input className="um-input" type="date" value={to} onChange={(e) => onTo(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
        <button className="um-btn-secondary" onClick={() => { onTicket(''); onCashier(''); onMethod('todos'); onDate(''); onFrom(''); onTo('') }} style={{ justifySelf: 'end', height: '2.4rem', padding: '0 0.9rem' }}>Limpiar</button>
      </div>
    </div>
  )
}

function SalesHistoryRow({ h, userById, onView }: {
  h: SaleHeader
  userById: Record<string, UserItem>
  onView: () => void
}) {
  const cashier = userById[h.cashier_id]
  const dt = new Date(h.created_at)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = String(dt.getFullYear())
  const HH = String(dt.getHours()).padStart(2, '0')
  const MM = String(dt.getMinutes()).padStart(2, '0')
  const SS = String(dt.getSeconds()).padStart(2, '0')
  const fdate = `${dd}/${mm}/${yyyy} ${HH}:${MM}:${SS}`
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr 1fr 0.8fr 1fr', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
      <div>#{h.ticket}</div>
      <div>{fdate}</div>
      <div>{cashier ? cashier.name : '-'}</div>
      <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
        <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: 999, border: '1px solid var(--um-border)', background: 'var(--um-surface)' }}>{h.payment_method}</span>
      </div>
      <div style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {h.total.toFixed(2)}</div>
      <div style={{ textAlign: 'right' }}>
        <button className="um-btn-secondary" onClick={onView}>Ver detalle</button>
      </div>
    </div>
  )
}

function SalesHistoryTable({ headers, userById, sortKey, sortDir, onSort, onViewTicket }: {
  headers: SaleHeader[]
  userById: Record<string, UserItem>
  sortKey: SortKey
  sortDir: SortDir
  onSort: (k: SortKey) => void
  onViewTicket: (ticket: string) => void
}) {
  const sorted = useMemo(() => {
    const list = [...headers]
    list.sort((a, b) => {
      if (sortKey === 'date') {
        const av = new Date(a.created_at).getTime()
        const bv = new Date(b.created_at).getTime()
        return sortDir === 'asc' ? av - bv : bv - av
      }
      if (sortKey === 'total') {
        return sortDir === 'asc' ? a.total - b.total : b.total - a.total
      }
      return 0
    })
    return list
  }, [headers, sortKey, sortDir])

  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr 1fr 0.8fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700, background: 'var(--um-bg)' }}>
        <div>Nº Ticket</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <span>Fecha y hora</span>
          <button className="um-btn-secondary" onClick={() => onSort('date')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div>Cajero responsable</div>
        <div>Método de pago</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <span>Total (S/)</span>
          <button className="um-btn-secondary" onClick={() => onSort('total')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div style={{ textAlign: 'right' }}>Acción</div>
      </div>
      <div>
        {sorted.map((h) => (
          <SalesHistoryRow key={h.ticket} h={h} userById={userById} onView={() => onViewTicket(h.ticket)} />
        ))}
      </div>
    </div>
  )
}

function SalesDetailModal({ open, header, user, items, productsById, onClose, onPrint, onDownloadPdf }: {
  open: boolean
  header: SaleHeader | null
  user: UserItem | null
  items: SaleDetail[]
  productsById: Record<string, ProductItem>
  onClose: () => void
  onPrint: () => void
  onDownloadPdf: () => void
}) {
  if (!open || !header) return null
  const dt = new Date(header.created_at)
  const fdate = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
  return (
    <div className={open ? 'um-overlay open' : 'um-overlay'}>
      <div role="dialog" aria-modal="true" aria-label="Detalle de venta" style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(720px, 96vw)', background: 'var(--um-surface)', border: '1px solid var(--um-border)', borderRadius: 12, boxShadow: 'var(--um-shadow)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--um-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <strong>Ticket #{header.ticket}</strong>
            <span style={{ color: 'var(--um-text)' }}>{fdate}</span>
          </div>
          <button className="um-btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div><strong>Cajero</strong><div>{user ? user.name : '-'}</div></div>
            <div><strong>Método de pago</strong><div>{header.payment_method}</div></div>
            <div><strong>Total</strong><div style={{ color: 'var(--um-success)', fontWeight: 800 }}>S/ {header.total.toFixed(2)}</div></div>
            <div><strong>Acciones</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="um-btn-secondary" onClick={onPrint}>Imprimir ticket</button>
                <button className="um-btn-secondary" onClick={onDownloadPdf}>Descargar PDF</button>
              </div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 0.8fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700, background: 'var(--um-bg)' }}>
              <div>Producto</div>
              <div>Categoría</div>
              <div>Cantidad</div>
              <div>Precio unitario</div>
              <div style={{ textAlign: 'right' }}>Subtotal</div>
            </div>
            <div>
              {items.map((it, i) => {
                const p = productsById[it.product_id]
                const subtotal = it.unit_price * it.qty
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr 0.8fr', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
                    <div>{p ? p.name : it.product_id}</div>
                    <div>{p ? p.category : '-'}</div>
                    <div>{it.qty}</div>
                    <div>S/ {it.unit_price.toFixed(2)}</div>
                    <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--um-success)' }}>S/ {subtotal.toFixed(2)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminHistorialVentas() {
  const [users] = useState<UserItem[]>([
    { id: 'u1', name: 'Ana Torres', email: 'ana@urbanmarket.com' },
    { id: 'u2', name: 'Luis Pérez', email: 'luis@urbanmarket.com' },
    { id: 'u3', name: 'María Gómez', email: 'maria@urbanmarket.com' },
  ])
  const [products] = useState<ProductItem[]>([
    { id: 'p1', name: 'Agua Mineral 625 ml', category: 'Bebidas' },
    { id: 'p2', name: 'Espumante Rubí 750 ml', category: 'Bebidas' },
    { id: 'p3', name: 'Cereal Crujiente 500 g', category: 'Desayuno' },
    { id: 'p4', name: 'Detergente Ropa 1 kg', category: 'Limpieza' },
  ])
  const [headers] = useState<SaleHeader[]>([
    { ticket: '000121', created_at: new Date('2025-01-14T09:35:00').toISOString(), cashier_id: 'u1', payment_method: 'efectivo', total: 45.6 },
    { ticket: '000122', created_at: new Date('2025-01-14T11:10:00').toISOString(), cashier_id: 'u2', payment_method: 'tarjeta', total: 80.1 },
    { ticket: '000123', created_at: new Date('2025-01-15T16:42:00').toISOString(), cashier_id: 'u1', payment_method: 'yape', total: 23.9 },
    { ticket: '000124', created_at: new Date('2025-01-16T13:05:00').toISOString(), cashier_id: 'u3', payment_method: 'efectivo', total: 120.0 },
  ])
  const [details] = useState<SaleDetail[]>([
    { ticket: '000121', product_id: 'p1', qty: 2, unit_price: 3.5 },
    { ticket: '000121', product_id: 'p3', qty: 1, unit_price: 8.6 },
    { ticket: '000122', product_id: 'p4', qty: 2, unit_price: 20.0 },
    { ticket: '000122', product_id: 'p2', qty: 1, unit_price: 40.1 },
    { ticket: '000123', product_id: 'p1', qty: 1, unit_price: 3.5 },
    { ticket: '000123', product_id: 'p3', qty: 2, unit_price: 8.2 },
    { ticket: '000124', product_id: 'p2', qty: 2, unit_price: 40.0 },
    { ticket: '000124', product_id: 'p4', qty: 1, unit_price: 40.0 },
  ])

  const usersById = useMemo(() => Object.fromEntries(users.map((u) => [u.id, u])), [users])
  const productsById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products])
  const detailsByTicket = useMemo(() => {
    const m: Record<string, SaleDetail[]> = {}
    for (const d of details) {
      if (!m[d.ticket]) m[d.ticket] = []
      m[d.ticket].push(d)
    }
    return m
  }, [details])

  const [qTicket, setQTicket] = useState('')
  const [qCashier, setQCashier] = useState('')
  const [qMethod, setQMethod] = useState<PaymentMethod | 'todos'>('todos')
  const [qDate, setQDate] = useState('')
  const [qFrom, setQFrom] = useState('')
  const [qTo, setQTo] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [openTicket, setOpenTicket] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const list = headers.filter((h) => {
      const t = qTicket.trim()
      const byTicket = t ? h.ticket.includes(t.replace(/^#/, '')) : true
      const byCashier = qCashier.trim() ? (usersById[h.cashier_id]?.name.toLowerCase().includes(qCashier.trim().toLowerCase())) : true
      const byMethod = qMethod === 'todos' ? true : h.payment_method === qMethod
      const d = new Date(h.created_at)
      const byDate = qDate ? d.toISOString().slice(0,10) === qDate : true
      const byRange = qFrom || qTo ? (
        (!qFrom || d >= new Date(qFrom + 'T00:00:00')) && (!qTo || d <= new Date(qTo + 'T23:59:59'))
      ) : true
      return byTicket && byCashier && byMethod && byDate && byRange
    })
    return list
  }, [headers, qTicket, qCashier, qMethod, qDate, qFrom, qTo, usersById])

  const currentHeader = useMemo(() => filtered.find((h) => h.ticket === openTicket) || null, [filtered, openTicket])
  const currentItems = useMemo(() => (openTicket ? detailsByTicket[openTicket] || [] : []), [openTicket, detailsByTicket])
  const currentUser = useMemo(() => (currentHeader ? usersById[currentHeader.cashier_id] || null : null), [currentHeader, usersById])

  function onSort(k: SortKey) {
    if (sortKey === k) setSortDir((v) => (v === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(k); setSortDir('asc') }
  }
  function onViewTicket(ticket: string) { setOpenTicket(ticket) }
  function onCloseModal() { setOpenTicket(null) }
  function onPrintTicket() { window.print() }
  function onDownloadPdf() {
    if (!currentHeader) return
    const lines = [`Ticket #${currentHeader.ticket}`, `Fecha: ${new Date(currentHeader.created_at).toLocaleString()}`, `Cajero: ${currentUser ? currentUser.name : '-'}`, `Método: ${currentHeader.payment_method}`, `Total: S/ ${currentHeader.total.toFixed(2)}`, '', 'Detalle:']
    for (const it of currentItems) {
      const p = productsById[it.product_id]
      lines.push(`- ${p ? p.name : it.product_id} x${it.qty} @ S/ ${it.unit_price.toFixed(2)} = S/ ${(it.qty * it.unit_price).toFixed(2)}`)
    }
    const blob = new Blob([lines.join('\n')], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Ticket-${currentHeader.ticket}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="um-home">
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <h2>Historial de todas las ventas</h2>
          <p>Listado y búsqueda de ventas.</p>
        </div>
        <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem' }}>
          <HistorySearchBar ticket={qTicket} cashier={qCashier} method={qMethod} date={qDate} from={qFrom} to={qTo} onTicket={setQTicket} onCashier={setQCashier} onMethod={setQMethod} onDate={setQDate} onFrom={setQFrom} onTo={setQTo} />
        </div>
        <SalesHistoryTable headers={filtered} userById={usersById} sortKey={sortKey} sortDir={sortDir} onSort={onSort} onViewTicket={onViewTicket} />
      </div>
      <SalesDetailModal open={openTicket !== null} header={currentHeader} user={currentUser} items={currentItems} productsById={productsById} onClose={onCloseModal} onPrint={onPrintTicket} onDownloadPdf={onDownloadPdf} />
    </section>
  )
}
