import type { ReactNode } from 'react'

type Props = { children: ReactNode; onNavigate: (p: string) => void; onLogout: () => void }

export default function AdminLayout({ children, onNavigate, onLogout }: Props) {
  return (
    <div className="um-app">
      <header className="um-header">
        <div className="um-topbar">
          <div className="um-logo">UrbanMarket POS</div>
          <nav aria-label="Menú admin" className="um-nav">
            <button className="um-nav-item" onClick={() => onNavigate('/admin/dashboard')}>Dashboard</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/productos')}>Productos</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/categorias')}>Categorías</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/usuarios')}>Usuarios</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/reportes-ventas')}>Reportes</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/reporte-caja')}>Caja</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/historial-ventas')}>Historial</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/movimientos-caja')}>Movimientos</button>
            <button className="um-nav-item" onClick={() => onNavigate('/admin/configuracion')}>Configuración</button>
          </nav>
          <button className="um-btn-secondary" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main className="um-content">{children}</main>
    </div>
  )
}
