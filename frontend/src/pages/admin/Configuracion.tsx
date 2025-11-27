import { useMemo, useState } from 'react'

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--um-border)', borderRadius: 12, background: 'var(--um-surface)', boxShadow: 'var(--um-shadow)', padding: '0.75rem 1rem', display: 'grid', gap: '0.6rem' }}>
      {children}
    </div>
  )
}

export default function AdminConfiguracion() {
  const [notifications, setNotifications] = useState(true)
  const [rememberCashbox, setRememberCashbox] = useState(false)
  const [trainingMode, setTrainingMode] = useState(false)

  const system = useMemo(() => ({ name: 'UrbanMarket POS', version: 'v1.0.0', author: 'Eduard de la Cruz y equipo', updatedAt: '16/01/2025 10:00' }), [])
  const admin = useMemo(() => ({ name: 'Admin Principal', email: 'admin@um.com', role: 'Administrador', lastLogin: '16/01/2025 08:30' }), [])

  function openDoc(label: string) { alert(`${label} (demo)`) }
  function backup() { alert('Respaldar información (demo)') }
  function restore() { alert('Restaurar información (demo)') }
  function resetLayout() { setNotifications(true); setRememberCashbox(false); setTrainingMode(false); alert('Layout y preferencias locales restablecidos') }

  return (
    <section className="um-home">
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: 4 }}>
          <h2>Configuración del sistema</h2>
          <p>Información general y parámetros simples del panel.</p>
        </div>

        <Card>
          <strong>Información del sistema</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div><div style={{ color: 'var(--um-text)' }}>Nombre del comercio</div><div style={{ fontWeight: 700 }}>{system.name}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Versión</div><div style={{ fontWeight: 700 }}>{system.version}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Desarrollado por</div><div style={{ fontWeight: 700 }}>{system.author}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Última actualización</div><div style={{ fontWeight: 700 }}>{system.updatedAt}</div></div>
          </div>
        </Card>

        <Card>
          <strong>Información del administrador</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div><div style={{ color: 'var(--um-text)' }}>Nombre</div><div style={{ fontWeight: 700 }}>{admin.name}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Email</div><div style={{ fontWeight: 700 }}>{admin.email}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Rol</div><div style={{ fontWeight: 700 }}>{admin.role}</div></div>
            <div><div style={{ color: 'var(--um-text)' }}>Último inicio de sesión</div><div style={{ fontWeight: 700 }}>{admin.lastLogin}</div></div>
          </div>
        </Card>

        <Card>
          <strong>Opciones del sistema</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
              <span>Habilitar notificaciones del sistema</span>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={rememberCashbox} onChange={(e) => setRememberCashbox(e.target.checked)} />
              <span>Recordar caja abierta automáticamente</span>
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={trainingMode} onChange={(e) => setTrainingMode(e.target.checked)} />
              <span>Modo entrenamiento (sin impacto en BD)</span>
            </label>
          </div>
        </Card>

        <Card>
          <strong>Documentación útil</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button className="um-btn-secondary" onClick={() => openDoc('Guía de uso del POS')}>Guía de uso del POS</button>
            <button className="um-btn-secondary" onClick={() => openDoc('Atajos del teclado')}>Atajos del teclado</button>
            <button className="um-btn-secondary" onClick={() => openDoc('Manual de cajero')}>Manual de cajero</button>
            <button className="um-btn-secondary" onClick={() => openDoc('Manual de administrador')}>Manual de administrador</button>
          </div>
        </Card>

        <Card>
          <strong>Acciones del sistema</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button className="um-btn-primary" onClick={backup}>Respaldar información (demo)</button>
            <button className="um-btn-secondary" onClick={restore}>Restaurar información (demo)</button>
            <button className="um-btn-secondary" onClick={resetLayout}>Restablecer layout del panel</button>
          </div>
        </Card>

        <Card>
          <strong>Seguridad</strong>
          <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--um-text)' }}>
            <li>Usar contraseñas fuertes</li>
            <li>Cerrar sesión al terminar</li>
            <li>No compartir credenciales</li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
