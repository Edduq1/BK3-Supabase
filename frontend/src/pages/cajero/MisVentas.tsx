import { useEffect, useMemo, useState } from 'react'
import { fetchMySalesHeaders, fetchSalesDetailsBySaleIds } from '../../services/salesService'
import { getCurrentUserRow } from '../../services/userService'

type PaymentMethod = 'efectivo' | 'yape' | 'plin' | 'tarjeta'
type SaleHeader = { ticket: string; created_at: string; total: number; method: PaymentMethod; cashier_id: string; status: 'pagado' }
type SaleDetail = { ticket: string; product: string; qty: number; unit_price: number }
type Preset = 'hoy' | 'ayer' | 'semana' | 'mes' | 'custom'
type SortKey = 'date' | 'total'
type SortDir = 'asc' | 'desc'

function FiltersBar({ preset, from, to, ticket, method, onPreset, onFrom, onTo, onTicket, onMethod, onReset }: {
  preset: Preset
  from: string
  to: string
  ticket: string
  method: PaymentMethod | 'todos'
  onPreset: (p: Preset) => void
  onFrom: (v: string) => void
  onTo: (v: string) => void
  onTicket: (v: string) => void
  onMethod: (v: PaymentMethod | 'todos') => void
  onReset: () => void
}) {
  return (
    <div className="um-toolbar">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
          <select className="um-input" value={preset} onChange={(e) => onPreset(e.target.value as Preset)} style={{ height: '2.4rem', padding: '0 0.75rem' }}>
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="custom">Personalizado</option>
          </select>
          <input className="um-input" type="date" value={from} onChange={(e) => onFrom(e.target.value)} disabled={preset !== 'custom'} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
          <input className="um-input" type="date" value={to} onChange={(e) => onTo(e.target.value)} disabled={preset !== 'custom'} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
          <input className="um-input" placeholder="#000152" value={ticket} onChange={(e) => onTicket(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
          <select className="um-input" value={method} onChange={(e) => onMethod(e.target.value as PaymentMethod | 'todos')} style={{ height: '2.4rem', padding: '0 0.75rem' }}>
            <option value="todos">Todos</option>
            <option value="efectivo">Efectivo</option>
            <option value="yape">Yape</option>
            <option value="plin">Plin</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
          <button className="um-btn-secondary" onClick={onReset} style={{ height: '2.4rem', padding: '0 0.9rem' }}>Limpiar</button>
        </div>
      </div>
    </div>
  )
}

function SalesRow({ h, onView }: { h: SaleHeader; onView: () => void }) {
  const dt = new Date(h.created_at)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = String(dt.getFullYear())
  const HH = String(dt.getHours()).padStart(2, '0')
  const MM = String(dt.getMinutes()).padStart(2, '0')
  const SS = String(dt.getSeconds()).padStart(2, '0')
  const fdate = `${dd}/${mm}/${yyyy} ${HH}:${MM}:${SS}`
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.8fr 1fr 0.8fr 1fr', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
      <div>#{h.ticket}</div>
      <div>{fdate}</div>
      <div style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {h.total.toFixed(2)}</div>
      <div>{h.method}</div>
      <div>{h.status}</div>
      <div style={{ textAlign: 'right' }}>
        <button className="um-btn-secondary" onClick={onView}>Ver detalle</button>
      </div>
    </div>
  )
}

function SalesTable({ headers, sortKey, sortDir, onSort, onViewTicket }: { headers: SaleHeader[]; sortKey: SortKey; sortDir: SortDir; onSort: (k: SortKey) => void; onViewTicket: (ticket: string) => void }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.8fr 1fr 0.8fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700, background: 'var(--um-bg)' }}>
        <div>Ticket</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Fecha y hora</span>
          <button className="um-btn-secondary" onClick={() => onSort('date')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Total (S/)</span>
          <button className="um-btn-secondary" onClick={() => onSort('total')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div>Método de pago</div>
        <div>Estado</div>
        <div style={{ textAlign: 'right' }}>Acción</div>
      </div>
      <div>
        {sorted.map((h) => (
          <SalesRow key={h.ticket} h={h} onView={() => onViewTicket(h.ticket)} />
        ))}
      </div>
    </div>
  )
}

function DetailModal({ open, header, items, onClose, onPrint }: { open: boolean; header: SaleHeader | null; items: SaleDetail[]; onClose: () => void; onPrint: () => void }) {
  if (!open || !header) return null
  const dt = new Date(header.created_at)
  const fdate = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
  const total = header.total
  return (
    <div className={open ? 'um-overlay open' : 'um-overlay'}>
      <div role="dialog" aria-modal="true" aria-label="Detalle de venta" style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(720px, 96vw)', background: 'var(--um-surface)', border: '1px solid var(--um-border)', borderRadius: 12, boxShadow: 'var(--um-shadow)' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--um-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 4 }}>
            <strong>Ticket #{header.ticket}</strong>
            <span style={{ color: 'var(--um-text)' }}>{fdate}</span>
          </div>
          <div style={{ display: 'inline-flex', gap: 8 }}>
            <button className="um-btn-secondary" onClick={onPrint}>Imprimir</button>
            <button className="um-btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '0.75rem', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <div><strong>Método</strong><div>{header.method}</div></div>
            <div><strong>Estado</strong><div>{header.status}</div></div>
            <div><strong>Total</strong><div style={{ color: 'var(--um-success)', fontWeight: 800 }}>S/ {total.toFixed(2)}</div></div>
          </div>
          <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700, background: 'var(--um-bg)' }}>
              <div>Producto</div>
              <div>Cantidad</div>
              <div>Precio unitario</div>
              <div style={{ textAlign: 'right' }}>Subtotal</div>
            </div>
            <div>
              {items.map((it, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.8fr', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
                  <div>{it.product}</div>
                  <div>{it.qty}</div>
                  <div>S/ {it.unit_price.toFixed(2)}</div>
                  <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--um-success)' }}>S/ {(it.qty * it.unit_price).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CashierMisVentas() {
  const [mineHeaders, setMineHeaders] = useState<SaleHeader[]>([])
  const [detailsByTicket, setDetailsByTicket] = useState<Record<string, SaleDetail[]>>({})
  useEffect(() => {
    ;(async () => {
      try {
        const u = await getCurrentUserRow()
        if (!u) return
        const headers = await fetchMySalesHeaders(String(u.id))
        const mappedH: SaleHeader[] = headers.map((h: any) => ({ ticket: String(h.id), created_at: h.created_at || new Date().toISOString(), total: Number(h.total), method: (h.payment_method as PaymentMethod), cashier_id: String(h.user_id), status: 'pagado' }))
        setMineHeaders(mappedH)
        const ids = headers.map((h: any) => String(h.id))
        const details = await fetchSalesDetailsBySaleIds(ids)
        const m: Record<string, SaleDetail[]> = {}
        for (const d of details as any[]) {
          const ticket = String(d.sale_id)
          if (!m[ticket]) m[ticket] = []
          m[ticket].push({ ticket, product: String(d.product_id), qty: Number(d.quantity), unit_price: Number(d.unit_price) })
        }
        setDetailsByTicket(m)
      } catch (e) {
        console.error('Error cargando ventas del cajero', e)
      }
    })()
  }, [])

  const [preset, setPreset] = useState<Preset>('semana')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [qTicket, setQTicket] = useState('')
  const [qMethod, setQMethod] = useState<PaymentMethod | 'todos'>('todos')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [openTicket, setOpenTicket] = useState<string | null>(null)

  const presetRange = useMemo(() => {
    const now = new Date('2025-01-16T12:00:00.000Z')
    const start = new Date(now)
    const end = new Date(now)
    if (preset === 'hoy') { /* same day */ }
    else if (preset === 'ayer') { start.setDate(start.getDate() - 1); end.setDate(end.getDate() - 1) }
    else if (preset === 'semana') { const day = start.getDay(); const diff = (day + 6) % 7; start.setDate(start.getDate() - diff) }
    else if (preset === 'mes') { start.setDate(1) }
    return { from: start.toISOString().slice(0,10), to: end.toISOString().slice(0,10) }
  }, [preset])

  const filtered = useMemo(() => {
    const list = mineHeaders.filter((h) => {
      const d = new Date(h.created_at)
      const f = preset === 'custom' ? from : presetRange.from
      const t = preset === 'custom' ? to : presetRange.to
      const byRange = (f ? d.toISOString().slice(0,10) >= f : true) && (t ? d.toISOString().slice(0,10) <= t : true)
      const byTicket = qTicket.trim() ? h.ticket.includes(qTicket.replace(/^#/, '')) : true
      const byMethod = qMethod === 'todos' ? true : h.method === qMethod
      return byRange && byTicket && byMethod
    })
    return list
  }, [mineHeaders, preset, presetRange, from, to, qTicket, qMethod])

  const dailyStats = useMemo(() => {
    const today = (preset === 'custom' ? from : presetRange.from) || new Date().toISOString().slice(0,10)
    const tickets = mineHeaders.filter((h) => h.created_at.slice(0,10) === today)
    const total = tickets.reduce((sum, h) => sum + h.total, 0)
    return { count: tickets.length, total }
  }, [mineHeaders, preset, presetRange, from])

  function onSort(k: SortKey) { if (sortKey === k) setSortDir((v) => (v === 'asc' ? 'desc' : 'asc')); else { setSortKey(k); setSortDir('asc') } }
  function onViewTicket(ticket: string) { setOpenTicket(ticket) }
  function onCloseModal() { setOpenTicket(null) }
  function onPrintTicket() { window.print() }
  function onReset() { setPreset('semana'); setFrom(''); setTo(''); setQTicket(''); setQMethod('todos') }

  const currentHeader = openTicket ? filtered.find((h) => h.ticket === openTicket) || null : null
  const currentItems = currentHeader ? (detailsByTicket[currentHeader.ticket] || []) : []

  return (
    <section className="um-home">
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <h2>Mis ventas</h2>
          <p>Listado de todas las ventas realizadas por este cajero.</p>
        </div>
        <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem' }}>
          <FiltersBar preset={preset} from={from} to={to} ticket={qTicket} method={qMethod} onPreset={setPreset} onFrom={setFrom} onTo={setTo} onTicket={setQTicket} onMethod={setQMethod} onReset={onReset} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
          <SalesTable headers={filtered} sortKey={sortKey} sortDir={sortDir} onSort={onSort} onViewTicket={onViewTicket} />
          <div className="um-summary-box" style={{ alignSelf: 'start' }}>
            <div className="um-summary-row"><span>Tickets de hoy</span><span>{dailyStats.count}</span></div>
            <div className="um-summary-row strong"><span>Total de hoy</span><span>S/ {dailyStats.total.toFixed(2)}</span></div>
            <div className="um-summary-row"><span>Total filtrado</span><span>S/ {filtered.reduce((s,h)=>s+h.total,0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <DetailModal open={openTicket !== null} header={currentHeader} items={currentItems} onClose={onCloseModal} onPrint={onPrintTicket} />
    </section>
  )
}
