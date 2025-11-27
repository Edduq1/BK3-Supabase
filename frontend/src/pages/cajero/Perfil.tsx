import { useEffect, useMemo, useState } from 'react'
import { getCurrentUserRow } from '../../services/userService'

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem 1rem', display: 'grid', gap: '0.6rem' }}>
      {children}
    </div>
  )
}

export default function CashierPerfil() {
  const [user, setUser] = useState({ id: '', name: '', email: '', role: 'Cajero', active: true, phone: '' })
  useEffect(() => {
    ;(async () => {
      try {
        const u = await getCurrentUserRow()
        if (u) setUser({ id: String(u.id), name: u.name || '', email: u.email || '', role: (u.role === 'CAJERO' ? 'Cajero' : String(u.role)), active: true, phone: '' })
      } catch (e) {
        console.error('Error cargando perfil del cajero', e)
      }
    })()
  }, [])
  const [editing, setEditing] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [pwdCurrent, setPwdCurrent] = useState('')
  const [pwdNew, setPwdNew] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')

  const activity = useMemo(() => ({ salesToday: 8, lastAccess: '16/01/2025 08:30', cashbox: 'Caja 1' }), [])

  function savePersonal() {
    if (!name.trim()) { alert('Nombre requerido'); return }
    setUser((u) => ({ ...u, name, phone }))
    setEditing(false)
    alert('Datos personales actualizados')
  }
  function changePassword() {
    if (!pwdNew || pwdNew.length < 6) { alert('La nueva contraseña debe tener al menos 6 caracteres'); return }
    if (pwdNew !== pwdConfirm) { alert('La confirmación no coincide'); return }
    setPwdCurrent(''); setPwdNew(''); setPwdConfirm(''); setChangingPwd(false)
    alert('Contraseña actualizada (demo)')
  }

  return (
    <section className="um-home" style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'grid', gap: 4 }}>
        <h2>Perfil del cajero</h2>
        <p>Datos personales y configuración.</p>
      </div>

      <Card>
        <strong>Información personal</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          <div><div style={{ color: 'var(--um-text)' }}>Nombre</div><div style={{ fontWeight: 700 }}>{user.name}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Email</div><div style={{ fontWeight: 700 }}>{user.email}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Rol</div><div style={{ fontWeight: 700 }}>{user.role}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Estado</div><div style={{ fontWeight: 700 }}>{user.active ? 'Activo' : 'Inactivo'}</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          <div><div style={{ color: 'var(--um-text)' }}>ID del cajero</div><div style={{ fontWeight: 700 }}>{user.id}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Teléfono</div><div style={{ fontWeight: 700 }}>{user.phone}</div></div>
        </div>
      </Card>

      <Card>
        <strong>Configuración personal</strong>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="um-btn-secondary" onClick={() => setEditing((v) => !v)}>{editing ? 'Cancelar' : 'Actualizar datos'}</button>
          <button className="um-btn-primary" onClick={() => setChangingPwd((v) => !v)}>{changingPwd ? 'Cancelar' : 'Cambiar contraseña'}</button>
        </div>
        {editing && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <input className="um-input" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
            <input className="um-input" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
            <button className="um-btn-primary" onClick={savePersonal}>Guardar</button>
          </div>
        )}
        {changingPwd && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', alignItems: 'center' }}>
            <input className="um-input" type="password" placeholder="Contraseña actual" value={pwdCurrent} onChange={(e) => setPwdCurrent(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
            <input className="um-input" type="password" placeholder="Nueva contraseña" value={pwdNew} onChange={(e) => setPwdNew(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
            <input className="um-input" type="password" placeholder="Confirmar contraseña" value={pwdConfirm} onChange={(e) => setPwdConfirm(e.target.value)} style={{ height: '2.4rem', padding: '0 0.75rem', boxSizing: 'border-box' }} />
            <button className="um-btn-secondary" onClick={changePassword}>Actualizar</button>
          </div>
        )}
      </Card>

      <Card>
        <strong>Resumen de actividad</strong>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <div><div style={{ color: 'var(--um-text)' }}>Ventas de hoy</div><div style={{ fontWeight: 700 }}>{activity.salesToday}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Último acceso</div><div style={{ fontWeight: 700 }}>{activity.lastAccess}</div></div>
          <div><div style={{ color: 'var(--um-text)' }}>Caja asignada</div><div style={{ fontWeight: 700 }}>{activity.cashbox}</div></div>
        </div>
      </Card>
    </section>
  )
}
