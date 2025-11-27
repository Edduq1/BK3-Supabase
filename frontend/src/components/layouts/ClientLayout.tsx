import type { ReactNode } from 'react'
import Header from '../Header'
type Role = 'ADMIN' | 'CAJERO' | 'CLIENTE'

type Props = {
  children: ReactNode
  cartCount: number
  query: string
  onQueryChange: (v: string) => void
  onCartClick: () => void
  onNavigate: (p: string) => void
  role: Role | null
  onLogout: () => void
}

export default function ClientLayout({ children, cartCount, query, onQueryChange, onCartClick, onNavigate, role, onLogout }: Props) {
  return (
    <div className="um-app">
      <Header cartCount={cartCount} query={query} onQueryChange={onQueryChange} onCartClick={onCartClick} onNavigate={onNavigate} role={role} onLogout={onLogout} />
      <main className="um-content">{children}</main>
    </div>
  )
}
