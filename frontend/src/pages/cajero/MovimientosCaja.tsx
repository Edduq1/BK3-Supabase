// === TU ARCHIVO COMPLETO ===
// (Validado. No requiere modificaciones)

import { useEffect, useMemo, useState } from 'react'
import { addCashMovement, fetchMyMovements } from '../../services/cashService'
import { getCurrentUserRow } from '../../services/userService'

type MovementType = 'apertura' | 'ingreso' | 'salida' | 'cierre'
type CashMovement = { 
  id: string; 
  user_id: string; 
  type: MovementType; 
  amount: number; 
  note: string; 
  created_at: string; 
  balance_after: number 
}

type SortKey = 'date' | 'amount' | 'type'
type SortDir = 'asc' | 'desc'

// ---------- Resumen ----------
function SummaryCard({ opened, openingTime, openingAmount, incomes, outcomes, balance }: {
  opened: boolean;
  openingTime: string | null;
  openingAmount: number | null;
  incomes: number;
  outcomes: number;
  balance: number;
}) {
  return (
    <div style={{ 
      border: '1px solid var(--um-border)', 
      borderRadius: 12, 
      background: 'var(--um-surface)', 
      boxShadow: 'var(--um-shadow)', 
      padding: '0.75rem 1rem', 
      display: 'grid', 
      gap: '0.6rem' 
    }}>
      <strong>Resumen del día</strong>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '0.5rem' 
      }}>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Estado</div>
          <div style={{ fontWeight: 700 }}>{opened ? 'Caja abierta' : 'Caja cerrada'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Hora de apertura</div>
          <div style={{ fontWeight: 700 }}>{openingTime || '-'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Monto inicial</div>
          <div style={{ fontWeight: 700 }}>S/ {openingAmount != null ? openingAmount.toFixed(2) : '0.00'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Saldo actual</div>
          <div style={{ fontWeight: 800, color: 'var(--um-success)' }}>S/ {balance.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '0.5rem' 
      }}>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Total ingresos</div>
          <div style={{ fontWeight: 700, color: 'var(--um-success)' }}>S/ {incomes.toFixed(2)}</div>
        </div>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Total salidas</div>
          <div style={{ fontWeight: 700, color: '#e53935' }}>S/ {outcomes.toFixed(2)}</div>
        </div>
        <div>
          <div style={{ color: 'var(--um-text)' }}>Diferencia</div>
          <div style={{ fontWeight: 700 }}>S/ {(incomes - outcomes + (openingAmount || 0)).toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

// ---------- Filtros ----------
function FiltersBar({ type, from, to, onType, onFrom, onTo }: {
  type: MovementType | 'todos';
  from: string;
  to: string;
  onType: (v: MovementType | 'todos') => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
}) {
  return (
    <div className="um-toolbar">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
        <select className="um-input" value={type} onChange={(e) => onType(e.target.value as MovementType | 'todos')}>
          <option value="todos">Todos</option>
          <option value="apertura">Apertura</option>
          <option value="ingreso">Ingreso</option>
          <option value="salida">Salida</option>
          <option value="cierre">Cierre</option>
        </select>

        <input className="um-input" type="time" value={from} onChange={(e) => onFrom(e.target.value)} />
        <input className="um-input" type="time" value={to} onChange={(e) => onTo(e.target.value)} />
      </div>
    </div>
  )
}

// ---------- Fila de movimiento ----------
function MovRow({ m }: { m: CashMovement }) {
  const dt = new Date(m.created_at)
  const time = dt.toLocaleTimeString()

  const color = 
    m.type === 'ingreso' ? 'var(--um-success)'
    : m.type === 'salida' ? '#e53935'
    : 'var(--um-text)'

  const icon =
    m.type === 'ingreso' ? '💵'
    : m.type === 'salida' ? '🔻'
    : m.type === 'apertura' ? '🔓'
    : '🔒'

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr',
      padding: '0.6rem 1rem',
      borderTop: '1px solid var(--um-border)'
    }}>
      <div>{time}</div>
      <div><span>{icon}</span> {m.type}</div>
      <div style={{ fontWeight: 700, color }}>
        {m.type === 'salida' ? `− S/ ${m.amount.toFixed(2)}` : `S/ ${m.amount.toFixed(2)}`}
      </div>
      <div>{m.note || '-'}</div>
      <div style={{ fontWeight: 700 }}>S/ {m.balance_after.toFixed(2)}</div>
    </div>
  )
}

// ---------- Tabla ----------
function MovTable({ rows, sortKey, sortDir, onSort }: {
  rows: CashMovement[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      if (sortKey === 'date') {
        return sortDir === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortKey === 'amount') {
        return sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount
      }
      if (sortKey === 'type') {
        return sortDir === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
      }
      return 0
    })
    return list
  }, [rows, sortKey, sortDir])

  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12 }}>
      <div style={{ 
        padding: '0.6rem 1rem', 
        fontWeight: 700, 
        background: 'var(--um-bg)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 2fr 1fr'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Hora</span>
          <button className="um-btn-secondary" onClick={() => onSort('date')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Tipo</span>
          <button className="um-btn-secondary" onClick={() => onSort('type')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Monto</span>
          <button className="um-btn-secondary" onClick={() => onSort('amount')} style={{ height: '2rem', padding: '0 0.6rem' }}>Ordenar</button>
        </div>
        <div>Nota</div>
        <div>Saldo</div>
      </div>
      <div>
        {sorted.map((m) => <MovRow key={m.id} m={m} />)}
      </div>
    </div>
  )
}

// ---------- Formularios ----------
function FormsGrid({ canOpen, canOperate, canClose, onOpen, onIncome, onOutcome, onClose }: {
  canOpen: boolean;
  canOperate: boolean;
  canClose: boolean;
  onOpen: (amount: number, note: string) => void;
  onIncome: (amount: number, note: string) => void;
  onOutcome: (amount: number, note: string) => void;
  onClose: (realAmount: number) => void;
}) {
  const [openAmount, setOpenAmount] = useState('')
  const [openNote, setOpenNote] = useState('')

  const [incomeAmount, setIncomeAmount] = useState('')
  const [incomeNote, setIncomeNote] = useState('')

  const [outAmount, setOutAmount] = useState('')
  const [outNote, setOutNote] = useState('')

  const [closeAmount, setCloseAmount] = useState('')

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '0.75rem' 
    }}>
      
      {/* Apertura */}
      <div className="um-box">
        <strong>🔓 Apertura de caja</strong>
        <input className="um-input" type="number" min="0" value={openAmount} onChange={(e) => setOpenAmount(e.target.value)} />
        <input className="um-input" value={openNote} onChange={(e) => setOpenNote(e.target.value)} />
        <button className="um-btn-primary" disabled={!canOpen} onClick={() => {
          const v = Number(openAmount)
          if (!Number.isFinite(v) || v < 0) return alert('Monto inválido')
          onOpen(v, openNote)
          setOpenAmount('')
          setOpenNote('')
        }}>Abrir caja</button>
      </div>

      {/* Ingreso */}
      <div className="um-box">
        <strong>💵 Registrar ingreso</strong>
        <input className="um-input" type="number" min="0" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
        <input className="um-input" value={incomeNote} onChange={(e) => setIncomeNote(e.target.value)} />
        <button 
          className="um-btn-secondary" 
          disabled={!canOperate}
          onClick={() => {
            const v = Number(incomeAmount)
            if (!Number.isFinite(v) || v <= 0) return alert('Monto inválido')
            onIncome(v, incomeNote)
            setIncomeAmount('')
            setIncomeNote('')
          }}
        >Registrar ingreso</button>
      </div>

      {/* Salida */}
      <div className="um-box">
        <strong>🔻 Registrar salida</strong>
        <input className="um-input" type="number" min="0" value={outAmount} onChange={(e) => setOutAmount(e.target.value)} />
        <input className="um-input" value={outNote} onChange={(e) => setOutNote(e.target.value)} />
        <button 
          className="um-btn-secondary" 
          disabled={!canOperate}
          onClick={() => {
            const v = Number(outAmount)
            if (!Number.isFinite(v) || v <= 0) return alert('Monto inválido')
            onOutcome(v, outNote)
            setOutAmount('')
            setOutNote('')
          }}
        >Registrar salida</button>
      </div>

      {/* Cierre */}
      <div className="um-box">
        <strong>🔒 Cierre de caja</strong>
        <input className="um-input" type="number" min="0" value={closeAmount} onChange={(e) => setCloseAmount(e.target.value)} />
        <button 
          className="um-btn-secondary" 
          disabled={!canClose}
          onClick={() => {
            const v = Number(closeAmount)
            if (!Number.isFinite(v) || v < 0) return alert('Monto inválido')
            onClose(v)
            setCloseAmount('')
          }}
        >Cerrar caja</button>
      </div>
    </div>
  )
}

// ---------- Página principal ----------
export default function CashierMovimientosCaja() {
  const [cashier, setCashier] = useState({ id: '', name: '' })
  const [movs, setMovs] = useState<CashMovement[]>([])

  useEffect(() => {
    ;(async () => {
      const u = await getCurrentUserRow()
      if (!u) return

      setCashier({ id: String(u.id), name: u.email })

      const rows = await fetchMyMovements()
      let balance = 0

      const mapped = (rows as any[]).map(r => {
        let next = balance

        if (r.type === 'apertura') next = Number(r.amount)
        else if (r.type === 'ingreso') next += Number(r.amount)
        else if (r.type === 'salida') next -= Number(r.amount)
        else if (r.type === 'cierre') next = next

        balance = next

        return {
          id: String(r.id),
          user_id: String(r.user_id),
          type: r.type,
          amount: Number(r.amount),
          note: r.note || '',
          created_at: r.created_at || new Date().toISOString(),
          balance_after: next
        }
      })

      setMovs(mapped)
    })()
  }, [])

  // Estado de apertura/cierre
const openedInfo = useMemo(() => {
  const aperturas = movs.filter(m => m.type === 'apertura')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const cierres = movs.filter(m => m.type === 'cierre')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const lastOpen = aperturas[0] || null
  const lastClose = cierres[0] || null

  const opened =
    lastOpen && (!lastClose || new Date(lastOpen.created_at) > new Date(lastClose.created_at))

  return {
    opened,
    openingTime: lastOpen ? new Date(lastOpen.created_at).toLocaleTimeString() : null,
    openingAmount: lastOpen ? lastOpen.amount : null,
  }
}, [movs])


  const totals = useMemo(() => {
    const incomes = movs.filter(m => m.type === 'ingreso').reduce((s, m) => s + m.amount, 0)
    const outcomes = movs.filter(m => m.type === 'salida').reduce((s, m) => s + m.amount, 0)
    const balance = movs.length ? movs[movs.length - 1].balance_after : 0
    return { incomes, outcomes, balance }
  }, [movs])

  async function addMovement(type: MovementType, amount: number, note: string, realClose?: boolean) {
    try {
      await addCashMovement(type, amount, note)

      const rows = await fetchMyMovements()

      let balance = 0
      const mapped = (rows as any[]).map(r => {
        let next = balance

        if (r.type === 'apertura') next = Number(r.amount)
        else if (r.type === 'ingreso') next += Number(r.amount)
        else if (r.type === 'salida') next -= Number(r.amount)
        else if (r.type === 'cierre') next = realClose ? Number(r.amount) : next

        balance = next

        return {
          id: String(r.id),
          user_id: String(r.user_id),
          type: r.type,
          amount: Number(r.amount),
          note: r.note || '',
          created_at: r.created_at || new Date().toISOString(),
          balance_after: next
        }
      })

      setMovs(mapped)
    } catch (e: any) {
      alert(e?.message || 'Error registrando movimiento')
    }
  }

  // flags
  const canOpen = !openedInfo.opened
  const canOperate = openedInfo.opened
  const canClose = openedInfo.opened

  // filtros
  const [qType, setQType] = useState<MovementType | 'todos'>('todos')
  const [qFrom, setQFrom] = useState('')
  const [qTo, setQTo] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  function toMinutes(t: string) {
    const [h, m] = t.split(':').map(Number)
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null
    return h * 60 + m
  }

  const filtered = useMemo(() => {
    return movs.filter(m => {
      const byType = qType === 'todos' ? true : m.type === qType

      const dt = new Date(m.created_at)
      const mins = dt.getHours() * 60 + dt.getMinutes()

      const fromM = toMinutes(qFrom)
      const toM = toMinutes(qTo)

      const okFrom = fromM != null ? mins >= fromM : true
      const okTo = toM != null ? mins <= toM : true

      return byType && okFrom && okTo
    })
  }, [movs, qType, qFrom, qTo])

  // ordenar
  function onSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(v => (v === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(k)
      setSortDir('asc')
    }
  }

  return (
    <section className="um-home" style={{ display: 'grid', gap: '0.75rem' }}>
      <h2>Movimientos de caja — Cajero {cashier.name}</h2>
      <p>Apertura, ingresos, salidas y cierre del día.</p>

      <SummaryCard 
        opened={openedInfo.opened}
        openingTime={openedInfo.openingTime}
        openingAmount={openedInfo.openingAmount}
        incomes={totals.incomes}
        outcomes={totals.outcomes}
        balance={totals.balance}
      />

      <FormsGrid
        canOpen={canOpen}
        canOperate={canOperate}
        canClose={canClose}
        onOpen={(amount, note) => addMovement('apertura', amount, note)}
        onIncome={(amount, note) => addMovement('ingreso', amount, note)}
        onOutcome={(amount, note) => addMovement('salida', amount, note)}
        onClose={(real) => addMovement('cierre', real, `Conteo real: S/ ${real.toFixed(2)}`, true)}
      />

      <div style={{ border: '1px solid var(--um-border)', borderRadius: 12 }}>
        <FiltersBar 
          type={qType}
          from={qFrom}
          to={qTo}
          onType={setQType}
          onFrom={setQFrom}
          onTo={setQTo}
        />
      </div>

      <MovTable 
        rows={filtered}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={onSort}
      />
    </section>
  )
}
