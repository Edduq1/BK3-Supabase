import { useMemo } from 'react'

type Kpi = { label: string; value: string; accent?: 'primary' | 'secondary' | 'success' }
type Ticket = { id: string; total: number; cashier: string; datetime: string }
type Movement = { type: 'Ingreso' | 'Salida' | 'Apertura' | 'Cierre'; amount: number; datetime: string }
type ProductSold = { name: string; qty: number; total: number }
type CategoryStat = { name: string; total: number }
type HourSale = { hour: number; total: number }
type WeekSale = { day: string; total: number }

function KpiCard({ k }: { k: Kpi }) {
  const color = k.accent === 'success' ? 'var(--um-success)' : k.accent === 'secondary' ? 'var(--um-secondary)' : 'var(--um-primary)'
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.9rem 1rem', display: 'grid', gap: 4 }}>
      <span style={{ color: 'var(--um-text-muted)', fontWeight: 600 }}>{k.label}</span>
      <span style={{ color, fontWeight: 800, fontSize: '1.6rem' }}>{k.value}</span>
    </div>
  )
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>{title}</div>
      <div style={{ padding: '0.75rem 1rem' }}>{children}</div>
    </div>
  )
}

function SalesLineChart({ data }: { data: HourSale[] }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.total)), [data])
  const points = useMemo(() => {
    const w = 520
    const h = 160
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (w - 20) + 10
      const y = h - (d.total / max) * (h - 30) - 10
      return `${x},${y}`
    }).join(' ')
  }, [data, max])
  return (
    <svg viewBox="0 0 540 180" style={{ width: '100%', height: 180 }}>
      <polyline points={points} fill="none" stroke="var(--um-primary)" strokeWidth={3} />
      {data.map((d, i) => {
        const w = 520
        const h = 160
        const x = (i / (data.length - 1)) * (w - 20) + 10
        const y = h - (d.total / max) * (h - 30) - 10
        return <circle key={i} cx={x} cy={y} r={3} fill="var(--um-primary)" />
      })}
    </svg>
  )
}

function BarChart({ data, color = 'var(--um-secondary)' }: { data: CategoryStat[]; color?: string }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => d.total)), [data])
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 12, alignItems: 'end', height: 180 }}>
      {data.map((d) => {
        const h = Math.round((d.total / max) * 140) + 20
        return (
          <div key={d.name} style={{ display: 'grid', alignItems: 'end', gap: 8 }}>
            <div style={{ height: h, background: color, borderRadius: 8 }} />
            <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>{d.name}</div>
          </div>
        )
      })}
    </div>
  )
}

function TicketsList({ items }: { items: Ticket[] }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>Últimos tickets</div>
      <div style={{ display: 'grid' }}>
        {items.map((t) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 0.8fr 0.8fr', padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
            <span>#{t.id}</span>
            <span style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {t.total.toFixed(2)}</span>
            <span>{t.cashier}</span>
            <span>{t.datetime}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MovementsList({ items }: { items: Movement[] }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>Movimientos de caja</div>
      <div style={{ display: 'grid' }}>
        {items.map((m, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 0.6fr 1fr', padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
            <span>{m.type}</span>
            <span style={{ fontWeight: 700, color: m.type === 'Salida' ? 'var(--um-primary)' : 'var(--um-success)' }}>S/ {m.amount.toFixed(2)}</span>
            <span>{m.datetime}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopProductsList({ items }: { items: ProductSold[] }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>Productos más vendidos</div>
      <div style={{ display: 'grid' }}>
        {items.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.6fr 0.6fr 0.8fr', padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            <span style={{ textAlign: 'right', fontWeight: 700 }}>{p.qty}</span>
            <span style={{ textAlign: 'right', fontWeight: 700, color: 'var(--um-success)' }}>S/ {p.total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LowStockList({ items }: { items: { name: string; stock: number }[] }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--um-border)', fontWeight: 700 }}>Productos con bajo stock</div>
      <div style={{ display: 'grid' }}>
        {items.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 0.4fr', padding: '0.6rem 1rem', borderTop: '1px solid var(--um-border)' }}>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            <span style={{ textAlign: 'right', color: 'var(--um-primary)', fontWeight: 700 }}>{p.stock}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const kpis: Kpi[] = [
    { label: 'Ventas totales del día', value: 'S/ 3,520.40', accent: 'success' },
    { label: 'Tickets emitidos', value: '128', accent: 'secondary' },
    { label: 'Monto actual de caja', value: 'S/ 1,255.00', accent: 'primary' },
    { label: 'Movimientos del día', value: 'Ingresos: 18 • Salidas: 6' }
  ]
  const salesByHour: HourSale[] = Array.from({ length: 12 }, (_, i) => ({ hour: 8 + i, total: [120,150,200,260,320,380,420,360,300,280,240,220][i] }))
  const categoryStats: CategoryStat[] = [
    { name: 'Bebidas', total: 980 },
    { name: 'Snacks', total: 720 },
    { name: 'Abarrotes', total: 640 },
    { name: 'Limpieza', total: 520 },
    { name: 'Desayuno', total: 450 }
  ]
  const weekStats: WeekSale[] = [
    { day: 'Lun', total: 2800 },
    { day: 'Mar', total: 3120 },
    { day: 'Mié', total: 2980 },
    { day: 'Jue', total: 3540 },
    { day: 'Vie', total: 4200 },
    { day: 'Sáb', total: 5100 },
    { day: 'Dom', total: 3880 }
  ]
  const tickets: Ticket[] = [
    { id: '000812', total: 42.9, cashier: 'Cajero 1', datetime: '2025-11-21 10:12' },
    { id: '000813', total: 18.5, cashier: 'Cajero 2', datetime: '2025-11-21 10:18' },
    { id: '000814', total: 73.2, cashier: 'Cajero 1', datetime: '2025-11-21 10:29' },
    { id: '000815', total: 25.0, cashier: 'Cajero 3', datetime: '2025-11-21 10:44' }
  ]
  const movements: Movement[] = [
    { type: 'Apertura', amount: 500, datetime: '2025-11-21 08:00' },
    { type: 'Ingreso', amount: 120, datetime: '2025-11-21 09:15' },
    { type: 'Salida', amount: 80, datetime: '2025-11-21 11:05' },
    { type: 'Ingreso', amount: 240, datetime: '2025-11-21 12:22' }
  ]
  const topProducts: ProductSold[] = [
    { name: 'Agua Mineral 625 ml', qty: 34, total: 357.0 },
    { name: 'Papas Fritas 90 g', qty: 26, total: 156.0 },
    { name: 'Pan Integral 500 g', qty: 18, total: 140.4 },
    { name: 'Detergente Ropa 1 kg', qty: 12, total: 222.0 }
  ]
  const lowStock = [
    { name: 'Café Molido 250 g', stock: 5 },
    { name: 'Leche Entera 1 L', stock: 6 },
    { name: 'Vinagre Blanco 500 ml', stock: 4 },
    { name: 'Chocolate Bitter 80 g', stock: 3 }
  ]

  return (
    <section className="um-home" style={{ display: 'grid', gap: '1rem' }}>
      <h2>UrbanMarket POS — Panel de administración</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {kpis.map((k) => <KpiCard key={k.label} k={k} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
        <ChartBox title="Ventas por hora">
          <SalesLineChart data={salesByHour} />
        </ChartBox>
        <ChartBox title="Categorías más vendidas">
          <BarChart data={categoryStats} />
        </ChartBox>
      </div>

      <ChartBox title="Evolución semanal de ventas">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weekStats.length}, 1fr)`, gap: 12, alignItems: 'end', height: 160 }}>
          {weekStats.map((d) => {
            const max = Math.max(...weekStats.map((w) => w.total))
            const h = Math.round((d.total / max) * 120) + 20
            return (
              <div key={d.day} style={{ display: 'grid', alignItems: 'end', gap: 8 }}>
                <div style={{ height: h, background: 'var(--um-success)', borderRadius: 8 }} />
                <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>{d.day}</div>
              </div>
            )
          })}
        </div>
      </ChartBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TicketsList items={tickets} />
        <MovementsList items={movements} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <TopProductsList items={topProducts} />
        <LowStockList items={lowStock} />
      </div>
    </section>
  )
}
