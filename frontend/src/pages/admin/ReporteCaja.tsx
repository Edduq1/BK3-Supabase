import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

// =============================
// Types
// =============================
type Role = 'admin' | 'cajero';
type User = { id: number; email: string; role: Role };

type MovementType = 'apertura' | 'ingreso' | 'salida' | 'cierre';

type CashMovement = {
  id: number;
  type: MovementType;
  amount: number;
  note: string;
  created_at: string;
  user_id: number;   // ← IMPORTANTÍSIMO: ES NUMBER
};

// =============================
// Filtros
// =============================
function CashFilters({
  from,
  to,
  cashier,
  type,
  users,
  onFrom,
  onTo,
  onCashier,
  onType,
  onGenerate,
}: {
  from: string;
  to: string;
  cashier: string;
  type: '' | MovementType;
  users: User[];
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onCashier: (v: string) => void;
  onType: (v: '' | MovementType) => void;
  onGenerate: () => void;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--um-border)',
        borderRadius: 12,
        background: 'var(--um-surface)',
        boxShadow: 'var(--um-shadow)',
        padding: '0.9rem 1rem',
        display: 'grid',
        gap: '0.75rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Reporte de caja</h2>
          <p style={{ margin: 0, color: 'var(--um-text)' }}>
            Estado de caja, aperturas, ingresos, salidas y cierres.
          </p>
        </div>
        <button
          className="um-btn-primary"
          onClick={onGenerate}
          style={{ padding: '0.6rem 1rem', fontWeight: 700 }}
        >
          Generar reporte
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(2, minmax(180px,1fr)) repeat(3, minmax(180px,1fr))',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        <input className="um-input" type="date" value={from} onChange={(e) => onFrom(e.target.value)} />
        <input className="um-input" type="date" value={to} onChange={(e) => onTo(e.target.value)} />

        <select className="um-select" value={cashier} onChange={(e) => onCashier(e.target.value)}>
          <option value="">Todos los cajeros</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email}
            </option>
          ))}
        </select>

        <select className="um-select" value={type} onChange={(e) => onType(e.target.value as MovementType | '')}>
          <option value="">Todos los tipos</option>
          <option value="apertura">Apertura</option>
          <option value="ingreso">Ingreso</option>
          <option value="salida">Salida</option>
          <option value="cierre">Cierre</option>
        </select>
      </div>
    </div>
  );
}

// =============================
// KPI COMPONENT
// =============================
function CashSummaryKpis({
  ingresos,
  salidas,
  balance,
  aperturas,
  cierres,
}: {
  ingresos: number;
  salidas: number;
  balance: number;
  aperturas: number;
  cierres: number;
}) {
  const items = [
    { label: 'Ingresos', value: `S/ ${ingresos.toFixed(2)}`, color: 'var(--um-success)' },
    { label: 'Salidas', value: `S/ ${salidas.toFixed(2)}`, color: 'var(--um-primary)' },
    {
      label: 'Balance',
      value: `S/ ${balance.toFixed(2)}`,
      color: balance >= 0 ? 'var(--um-success)' : 'var(--um-primary)',
    },
    { label: 'Aperturas', value: String(aperturas), color: 'var(--um-secondary)' },
    { label: 'Cierres', value: String(cierres), color: 'var(--um-secondary)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(160px,1fr))', gap: '0.75rem' }}>
      {items.map((k, i) => (
        <div
          key={i}
          style={{
            border: '1px solid var(--um-border)',
            borderRadius: 12,
            background: 'var(--um-surface)',
            boxShadow: 'var(--um-shadow)',
            padding: '0.9rem 1rem',
            display: 'grid',
            gap: 4,
          }}
        >
          <span style={{ color: 'var(--um-text)', fontWeight: 600 }}>{k.label}</span>
          <span style={{ color: k.color, fontWeight: 800, fontSize: '1.1rem' }}>{k.value}</span>
        </div>
      ))}
    </div>
  );
}

// =============================
// MOVEMENT ROW
// =============================
function CashMovementRow({ m, userEmail }: { m: CashMovement; userEmail: string }) {
  const color =
    m.type === 'apertura'
      ? '#4AA3DF'
      : m.type === 'ingreso'
      ? 'var(--um-success)'
      : m.type === 'salida'
      ? 'var(--um-primary)'
      : '#999999';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr 2fr',
        alignItems: 'center',
        gap: 12,
        padding: '0.6rem 1rem',
        borderTop: '1px solid var(--um-border)',
      }}
    >
      <div>{new Date(m.created_at).toLocaleString()}</div>

      <div>
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            borderRadius: 999,
            background: color,
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {m.type}
        </span>
      </div>

      <div style={{ fontWeight: 700, color: m.type === 'salida' ? 'var(--um-primary)' : 'var(--um-success)' }}>
        S/ {m.amount.toFixed(2)}
      </div>

      <div>{userEmail}</div>
      <div>{m.note}</div>
    </div>
  );
}

// =============================
// MOVEMENTS TABLE
// =============================
function CashMovementsTable({
  movements,
  usersById,
}: {
  movements: CashMovement[];
  usersById: Record<number, User>;
}) {
  return (
    <div
      style={{
        border: '1px solid var(--um-border)',
        borderRadius: 12,
        background: 'var(--um-surface)',
        boxShadow: 'var(--um-shadow)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr 2fr',
          gap: 12,
          padding: '0.6rem 1rem',
          fontWeight: 700,
        }}
      >
        <div>Fecha y hora</div>
        <div>Tipo</div>
        <div>Monto</div>
        <div>Cajero</div>
        <div>Nota</div>
      </div>

      <div>
        {movements.map((m) => (
          <CashMovementRow key={m.id} m={m} userEmail={usersById[m.user_id]?.email || '—'} />
        ))}
      </div>
    </div>
  );
}

// =============================
// MAIN COMPONENT
// =============================
export default function AdminReporteCaja() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const [from, setFrom] = useState(`${yyyy}-${mm}-${dd}`);
  const [to, setTo] = useState(`${yyyy}-${mm}-${dd}`);

  const [users, setUsers] = useState<User[]>([]);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [cashier, setCashier] = useState('');
  const [type, setType] = useState<'' | MovementType>('');

  // =============================
  // LOAD USERS (CORRECTO)
  // =============================
  async function loadUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .in('role', ['cajero']);

    if (error) return console.log(error);

    const mapped = data.map((u) => ({
      id: u.id, // ← ESTO COINCIDE CON user_id de cash_movements
      email: u.email,
      role: u.role,
    }));

    setUsers(mapped);
  }

  // =============================
  // LOAD MOVEMENTS
  // =============================
  async function loadMovements() {
    const fromIso = `${from}T00:00:00+00:00`;
    const toIso = `${to}T23:59:59+00:00`;

    const { data, error } = await supabase
      .from('cash_movements')
      .select('*')
      .gte('created_at', fromIso)
      .lte('created_at', toIso)
      .order('created_at', { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setMovements(data || []);
  }

  function generateReport() {
    loadMovements();
  }

  useEffect(() => {
    loadUsers();
    loadMovements();
  }, []);

  // FILTERING
  const filtered = useMemo(() => {
    return movements.filter((m) => {
      const okCashier = cashier ? m.user_id === Number(cashier) : true;
      const okType = type ? m.type === type : true;
      return okCashier && okType;
    });
  }, [movements, cashier, type]);

  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );

  // KPIs
  const ingresos = filtered.filter((m) => m.type === 'ingreso').reduce((s, m) => s + m.amount, 0);
  const salidas = filtered.filter((m) => m.type === 'salida').reduce((s, m) => s + m.amount, 0);
  const aperturas = filtered.filter((m) => m.type === 'apertura').length;
  const cierres = filtered.filter((m) => m.type === 'cierre').length;
  const balance = ingresos - salidas;

  return (
    <div className="um-step um-step-in" style={{ display: 'grid', gap: '1rem' }}>
      <CashFilters
        from={from}
        to={to}
        cashier={cashier}
        type={type}
        users={users}
        onFrom={setFrom}
        onTo={setTo}
        onCashier={setCashier}
        onType={setType}
        onGenerate={generateReport}
      />

      <CashSummaryKpis
        ingresos={ingresos}
        salidas={salidas}
        balance={balance}
        aperturas={aperturas}
        cierres={cierres}
      />

      <CashMovementsTable movements={filtered} usersById={usersById} />
    </div>
  );
}
