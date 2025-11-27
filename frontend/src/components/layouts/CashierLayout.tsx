import type { ReactNode } from 'react'

type Props = { children: ReactNode; onNavigate: (p: string) => void; onLogout: () => void }

export default function CashierLayout({ children, onNavigate, onLogout }: Props) {
  return (
    <div className="um-app">
      <header className="um-header">
        <div className="um-topbar">
          <div className="um-logo">UrbanMarket POS</div>
          <nav aria-label="Menú cajero" className="um-nav">
            <button className="um-nav-item" onClick={() => onNavigate('/cajero/pos')}>POS</button>
            <button className="um-nav-item" onClick={() => onNavigate('/cajero/mis-ventas')}>Mis ventas</button>
            <button className="um-nav-item" onClick={() => onNavigate('/cajero/movimientos-caja')}>Movimientos de caja</button>
            <button className="um-nav-item" onClick={() => onNavigate('/cajero/perfil')}>Perfil</button>
          </nav>
          <button className="um-btn-secondary" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main className="um-content">{children}</main>
    </div>
  )
}
