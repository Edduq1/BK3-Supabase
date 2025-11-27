import { useMemo, useState } from 'react'

type Role = 'admin' | 'cajero'
type User = { id: string; email: string; role: Role }
type Category = { id: string; name: string }
type Product = { id: string; name: string; price: number; category_id: string }
type SaleHeader = { id: string; datetime: string; user_id: string; total: number; payment_method: 'Efectivo' | 'Tarjeta' | 'Yape' }
type SaleDetail = { sale_id: string; product_id: string; quantity: number; unit_price: number; subtotal: number }

function ReportsFilters({ from, to, cashier, method, category, product, users, categories, products, onFrom, onTo, onCashier, onMethod, onCategory, onProduct, onGenerate }: { from: string; to: string; cashier: string; method: '' | SaleHeader['payment_method']; category: string; product: string; users: User[]; categories: Category[]; products: Product[]; onFrom: (v: string) => void; onTo: (v: string) => void; onCashier: (v: string) => void; onMethod: (v: '' | SaleHeader['payment_method']) => void; onCategory: (v: string) => void; onProduct: (v: string) => void; onGenerate: () => void }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.9rem 1rem', display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>Reportes de ventas</h2>
          <p style={{ margin: 0, color: 'var(--um-text)' }}>Reportes por período, producto y categoría.</p>
        </div>
        <button className="um-btn-primary" onClick={onGenerate} style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Generar reporte</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, 1fr)) repeat(4, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
        <input className="um-input" type="date" value={from} onChange={(e) => onFrom(e.target.value)} aria-label="Desde" style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', boxSizing: 'border-box' }} />
        <input className="um-input" type="date" value={to} onChange={(e) => onTo(e.target.value)} aria-label="Hasta" style={{ width: '100%', height: '2.2rem', padding: '0 0.6rem', boxSizing: 'border-box' }} />
        <select className="um-select" value={cashier} onChange={(e) => onCashier(e.target.value)} aria-label="Cajero" style={{ height: '2.2rem' }}>
          <option value="">Todos los cajeros</option>
          {users.filter((u) => u.role === 'cajero').map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
        </select>
        <select className="um-select" value={method} onChange={(e) => onMethod(e.target.value as '' | SaleHeader['payment_method'])} aria-label="Método de pago" style={{ height: '2.2rem' }}>
          <option value="">Todos los métodos</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Yape">Yape</option>
        </select>
        <select className="um-select" value={category} onChange={(e) => onCategory(e.target.value)} aria-label="Categoría" style={{ height: '2.2rem' }}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="um-select" value={product} onChange={(e) => onProduct(e.target.value)} aria-label="Producto" style={{ height: '2.2rem' }}>
          <option value="">Todos los productos</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
    </div>
  )
}

function ReportsSummaryKpis({ total, tickets, avg, qty, topProduct, topCategory }: { total: number; tickets: number; avg: number; qty: number; topProduct: string; topCategory: string }) {
  const items = [
    { label: 'Total vendido', value: `S/ ${total.toFixed(2)}`, accent: 'success' },
    { label: 'Tickets emitidos', value: String(tickets), accent: 'secondary' },
    { label: 'Ticket promedio', value: `S/ ${avg.toFixed(2)}`, accent: 'primary' },
    { label: 'Unidades vendidas', value: String(qty), accent: 'secondary' },
    { label: 'Producto más vendido', value: topProduct, accent: 'primary' },
    { label: 'Categoría más vendida', value: topCategory, accent: 'success' },
  ]
  function color(a: string) { return a === 'success' ? 'var(--um-success)' : a === 'secondary' ? 'var(--um-secondary)' : 'var(--um-primary)' }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(160px,1fr))', gap: '0.75rem' }}>
      {items.map((k, i) => (
        <div key={i} style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.9rem 1rem', display: 'grid', gap: 4 }}>
          <span style={{ color: 'var(--um-text)', fontWeight: 600 }}>{k.label}</span>
          <span style={{ color: color(k.accent), fontWeight: 800, fontSize: '1.1rem' }}>{k.value}</span>
        </div>
      ))}
    </div>
  )
}

function ReportsSalesChart({ points }: { points: { date: string; total: number }[] }) {
  const max = useMemo(() => Math.max(1, ...points.map((d) => d.total)), [points])
  const xy = useMemo(() => {
    const w = 680
    const h = 180
    return points.map((d, i) => {
      const x = (i / Math.max(1, points.length - 1)) * (w - 20) + 10
      const y = h - (d.total / max) * (h - 30) - 10
      return `${x},${y}`
    }).join(' ')
  }, [points, max])
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.6rem' }}>
      <svg viewBox="0 0 700 200" style={{ width: '100%', height: 200 }}>
        <polyline points={xy} fill="none" stroke="var(--um-primary)" strokeWidth={3} />
        {points.map((d, i) => {
          const w = 680
          const h = 180
          const x = (i / Math.max(1, points.length - 1)) * (w - 20) + 10
          const y = h - (d.total / max) * (h - 30) - 10
          return <circle key={i} cx={x} cy={y} r={3} fill="var(--um-primary)" />
        })}
      </svg>
    </div>
  )
}

function ReportsPaymentChart({ data }: { data: { method: string; total: number }[] }) {
  const sum = useMemo(() => data.reduce((s, d) => s + d.total, 0), [data])
  const angles = useMemo(() => data.map((d) => ({ label: d.method, angle: sum > 0 ? (d.total / sum) * 2 * Math.PI : 0 })), [data, sum])
  const colors = ['var(--um-primary)', 'var(--um-secondary)', 'var(--um-success)']
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.6rem', display: 'grid', placeItems: 'center' }}>
      <svg viewBox="0 0 200 200" style={{ width: 200, height: 200 }}>
        {(() => {
          const arcs = angles.reduce<{ start: number; end: number }[]>((acc, a) => {
            const start = acc.length === 0 ? 0 : acc[acc.length - 1].end
            const end = start + a.angle
            acc.push({ start, end })
            return acc
          }, [])
          return arcs.map((arc, i) => {
            const x1 = 100 + 90 * Math.cos(arc.start)
            const y1 = 100 + 90 * Math.sin(arc.start)
            const x2 = 100 + 90 * Math.cos(arc.end)
            const y2 = 100 + 90 * Math.sin(arc.end)
            const largeArc = arc.end - arc.start > Math.PI ? 1 : 0
            return <path key={i} d={`M100,100 L${x1},${y1} A90,90 0 ${largeArc} 1 ${x2},${y2} Z`} fill={colors[i % colors.length]} />
          })
        })()}
      </svg>
    </div>
  )
}

function ReportsProductsChart({ data }: { data: { name: string; qty: number }[] }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.qty)), [data])
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.6rem', display: 'grid', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', alignItems: 'center', gap: 8 }}>
          <div style={{ height: 20, background: 'var(--um-background)', border: '1px solid var(--um-border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: `${(d.qty / max) * 100}%`, height: '100%', background: 'var(--um-secondary)' }} />
          </div>
          <div style={{ fontWeight: 700 }}>{d.qty}</div>
        </div>
      ))}
    </div>
  )
}

function SalesTable({ headers, usersById }: { headers: SaleHeader[]; usersById: Record<string, User> }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.4fr 1.4fr 1fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700 }}>
        <div>Nº Ticket</div>
        <div>Fecha y hora</div>
        <div>Cajero</div>
        <div>Total</div>
        <div>Método</div>
      </div>
      <div>
        {headers.map((h) => (
          <div key={h.id} style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.4fr 1.4fr 1fr 1fr', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
            <div style={{ fontWeight: 600 }}>{h.id}</div>
            <div>{new Date(h.datetime).toLocaleString()}</div>
            <div>{usersById[h.user_id]?.email || '—'}</div>
            <div style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {h.total.toFixed(2)}</div>
            <div>{h.payment_method}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SalesDetailTable({ details, productsById, categoriesById }: { details: SaleDetail[]; productsById: Record<string, Product>; categoriesById: Record<string, Category> }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '0.6rem 1rem', fontWeight: 700 }}>
        <div>Producto</div>
        <div>Categoría</div>
        <div>Cantidad</div>
        <div>Subtotal</div>
      </div>
      <div>
        {details.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', alignItems: 'center', gap: 12, padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
            <div style={{ fontWeight: 600 }}>{productsById[d.product_id]?.name || '—'}</div>
            <div>{categoriesById[productsById[d.product_id]?.category_id || '']?.name || '—'}</div>
            <div>{d.quantity}</div>
            <div style={{ fontWeight: 700 }}>S/ {d.subtotal.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExportButtons({ onCsvHeaders, onCsvDetails, onPrint }: { onCsvHeaders: () => void; onCsvDetails: () => void; onPrint: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <button className="um-btn-secondary" onClick={onCsvHeaders} style={{ padding: '0.5rem 0.9rem' }}>Descargar CSV ventas</button>
      <button className="um-btn-secondary" onClick={onCsvDetails} style={{ padding: '0.5rem 0.9rem' }}>Descargar CSV detalles</button>
      <button className="um-btn-primary" onClick={onPrint} style={{ padding: '0.5rem 0.9rem', fontWeight: 700 }}>Imprimir reporte</button>
    </div>
  )
}

export default function AdminReportesVentas() {
  const users: User[] = [
    { id: 'u1', email: 'admin@urbanmarket.com', role: 'admin' },
    { id: 'u2', email: 'cajero1@urbanmarket.com', role: 'cajero' },
    { id: 'u3', email: 'cajero2@urbanmarket.com', role: 'cajero' },
  ]
  const categories: Category[] = [
    { id: 'c1', name: 'Bebidas' },
    { id: 'c2', name: 'Snacks' },
    { id: 'c3', name: 'Abarrotes' },
    { id: 'c4', name: 'Limpieza' },
    { id: 'c5', name: 'Desayuno' },
  ]
  const products: Product[] = [
    { id: 'p1', name: 'Agua Mineral 625 ml', price: 10.5, category_id: 'c1' },
    { id: 'p2', name: 'Espumante Rubí 750 ml', price: 54.9, category_id: 'c1' },
    { id: 'p3', name: 'Cerveza Pack 6', price: 33.9, category_id: 'c1' },
    { id: 'p4', name: 'Gomitas Surtidas 130g', price: 9.7, category_id: 'c2' },
    { id: 'p5', name: 'Papas Fritas 90 g', price: 6.0, category_id: 'c2' },
    { id: 'p6', name: 'Pan Integral 500 g', price: 7.8, category_id: 'c5' },
    { id: 'p7', name: 'Aceite Vegetal 1 L', price: 16.9, category_id: 'c3' },
    { id: 'p8', name: 'Detergente Ropa 1 kg', price: 18.5, category_id: 'c4' },
    { id: 'p9', name: 'Café Molido 250 g', price: 19.9, category_id: 'c5' },
    { id: 'p10', name: 'Chocolate Bitter 80 g', price: 11.5, category_id: 'c2' },
  ]

  const [from, setFrom] = useState('2025-01-14')
  const [to, setTo] = useState('2025-01-20')
  const [cashier, setCashier] = useState('')
  const [method, setMethod] = useState<'' | SaleHeader['payment_method']>('')
  const [category, setCategory] = useState('')
  const [productId, setProductId] = useState('')
  

  function seeded(n: number) { let s = n; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 } }
  const rand = seeded(42)
  const headers: SaleHeader[] = (() => {
    const out: SaleHeader[] = []
    for (let i = 0; i < 14; i++) {
      const base = new Date('2025-01-20T00:00:00.000Z').getTime()
      const day = new Date(base - i * 86400000)
      const count = 6 + Math.floor(rand() * 6)
      for (let j = 0; j < count; j++) {
        const id = `${String(day.getDate()).padStart(2, '0')}${String(j).padStart(2, '0')}`
        const pm: SaleHeader['payment_method'] = rand() < 0.4 ? 'Tarjeta' : rand() < 0.7 ? 'Efectivo' : 'Yape'
        const u = users[1 + (Math.floor(rand() * 2))]
        const total = 20 + Math.floor(rand() * 120)
        out.push({ id, datetime: new Date(day.getTime() + j * 3600000).toISOString(), user_id: u.id, total, payment_method: pm })
      }
    }
    return out
  })()
  const details: SaleDetail[] = (() => {
    const out: SaleDetail[] = []
    headers.forEach((h) => {
      const items = 1 + Math.floor(rand() * 4)
      for (let k = 0; k < items; k++) {
        const p = products[Math.floor(rand() * products.length)]
        const q = 1 + Math.floor(rand() * 5)
        const up = p.price
        out.push({ sale_id: h.id, product_id: p.id, quantity: q, unit_price: up, subtotal: up * q })
      }
    })
    return out
  })()

  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c]))
  const productsById = Object.fromEntries(products.map((p) => [p.id, p]))
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  const filteredHeaders = (() => {
    const start = new Date(from).getTime()
    const end = new Date(to).getTime() + 86400000 - 1
    return headers.filter((h) => {
      const t = new Date(h.datetime).getTime()
      const okDate = t >= start && t <= end
      const okCashier = cashier ? h.user_id === cashier : true
      const okMethod = method ? h.payment_method === method : true
      return okDate && okCashier && okMethod
    })
  })()

  const headerIds = new Set(filteredHeaders.map((h) => h.id))
  const filteredDetails = details.filter((d) => {
    const okHeader = headerIds.has(d.sale_id)
    const okCategory = category ? productsById[d.product_id]?.category_id === category : true
    const okProduct = productId ? d.product_id === productId : true
    return okHeader && okCategory && okProduct
  })

  const kpis = (() => {
    const total = filteredHeaders.reduce((s, h) => s + h.total, 0)
    const tickets = filteredHeaders.length
    const avg = tickets > 0 ? total / tickets : 0
    const qty = filteredDetails.reduce((s, d) => s + d.quantity, 0)
    const byProduct = new Map<string, number>()
    filteredDetails.forEach((d) => byProduct.set(d.product_id, (byProduct.get(d.product_id) || 0) + d.quantity))
    let topProductId = ''; let topQty = -1
    byProduct.forEach((q, pid) => { if (q > topQty) { topQty = q; topProductId = pid } })
    const byCategory = new Map<string, number>()
    filteredDetails.forEach((d) => {
      const cid = productsById[d.product_id]?.category_id
      if (cid) byCategory.set(cid, (byCategory.get(cid) || 0) + d.quantity)
    })
    let topCategoryId = ''; let topCatQty = -1
    byCategory.forEach((q, cid) => { if (q > topCatQty) { topCatQty = q; topCategoryId = cid } })
    return { total, tickets, avg, qty, topProduct: productsById[topProductId]?.name || '—', topCategory: categoriesById[topCategoryId]?.name || '—' }
  })()

  const salesByDay = useMemo(() => {
    const map = new Map<string, number>()
    filteredHeaders.forEach((h) => {
      const d = new Date(h.datetime).toISOString().slice(0, 10)
      map.set(d, (map.get(d) || 0) + h.total)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total }))
  }, [filteredHeaders])

  const salesByMethod = useMemo(() => {
    const map = new Map<string, number>()
    filteredHeaders.forEach((h) => map.set(h.payment_method, (map.get(h.payment_method) || 0) + h.total))
    return Array.from(map.entries()).map(([method, total]) => ({ method, total }))
  }, [filteredHeaders])

  const topProducts = useMemo(() => {
    const map = new Map<string, number>()
    filteredDetails.forEach((d) => map.set(d.product_id, (map.get(d.product_id) || 0) + d.quantity))
    const arr = Array.from(map.entries()).map(([pid, qty]) => ({ name: productsById[pid]?.name || '—', qty }))
    arr.sort((a, b) => b.qty - a.qty)
    return arr.slice(0, 10)
  }, [filteredDetails, productsById])

  function csvHeaders() {
    const rows = [['ticket', 'datetime', 'cashier', 'total', 'method']].concat(
      filteredHeaders.map((h) => [h.id, new Date(h.datetime).toLocaleString(), usersById[h.user_id]?.email || '', String(h.total), h.payment_method])
    )
    downloadCsv(rows, 'ventas.csv')
  }
  function csvDetails() {
    const rows = [['product', 'category', 'qty', 'unit_price', 'subtotal']].concat(
      filteredDetails.map((d) => [productsById[d.product_id]?.name || '', categoriesById[productsById[d.product_id]?.category_id || '']?.name || '', String(d.quantity), String(d.unit_price), String(d.subtotal)])
    )
    downloadCsv(rows, 'detalles.csv')
  }
  function downloadCsv(rows: string[][], name: string) {
    const csv = rows.map((r) => r.map((c) => '"' + c.replaceAll('"', '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="um-step um-step-in" style={{ display: 'grid', gap: '1rem' }}>
      <ReportsFilters from={from} to={to} cashier={cashier} method={method} category={category} product={productId} users={users} categories={categories} products={products} onFrom={setFrom} onTo={setTo} onCashier={setCashier} onMethod={setMethod} onCategory={setCategory} onProduct={setProductId} onGenerate={() => {}} />

      <ReportsSummaryKpis total={kpis.total} tickets={kpis.tickets} avg={kpis.avg} qty={kpis.qty} topProduct={kpis.topProduct} topCategory={kpis.topCategory} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
        <ReportsSalesChart points={salesByDay} />
        <ReportsPaymentChart data={salesByMethod} />
      </div>

      <ReportsProductsChart data={topProducts} />

      <SalesTable headers={filteredHeaders} usersById={usersById} />
      <SalesDetailTable details={filteredDetails} productsById={productsById} categoriesById={categoriesById} />

      <ExportButtons onCsvHeaders={csvHeaders} onCsvDetails={csvDetails} onPrint={() => window.print()} />

      <div style={{ display: 'grid', gap: '0.5rem', opacity: 0.85 }}>
        <small style={{ color: 'var(--um-text)' }}>Para conectar con Supabase, reemplazar los mocks por consultas que agreguen ventas por rango y filtros, uniendo sales_header y sales_detail con products, categories y users mediante vistas o RPC.</small>
      </div>
    </div>
  )
}
