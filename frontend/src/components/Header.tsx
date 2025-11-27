import { useEffect, useRef, useState } from 'react'
import SearchBar from './SearchBar'
import CartImage from '../assets/iconos/carrito-de-compras.png'
import UserIcon from '../assets/iconos/usuario.png'
import LoginIcon from '../assets/iconos/esquema-del-boton-de-flecha-cuadrada-de-inicio-de-sesion.png'
import ProfileIcon from '../assets/iconos/acceso.png'
import LogoutIcon from '../assets/iconos/cerrar-sesion.png'
type Role = 'ADMIN' | 'CAJERO' | 'CLIENTE'

type Props = {
  cartCount: number
  query: string
  onQueryChange: (v: string) => void
  onCartClick: () => void
  onNavigate: (path: string) => void
  role?: Role | null
  onLogout?: () => void
}

export default function Header({ cartCount, query, onQueryChange, onCartClick, onNavigate, role, onLogout }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const onToggleAccount = () => setDropdownOpen((v) => !v)

  return (
    <header className="um-header">
      <div className="um-topbar">
        <div className="um-logo">UrbanMarket</div>
        <nav aria-label="Menú principal" className="um-nav">
          <button className="um-nav-item" onClick={() => onNavigate('/')}>Inicio</button>
          <button className="um-nav-item" onClick={() => onNavigate('/productos')}>Productos</button>
          <button className="um-nav-item" onClick={() => onNavigate('/trabaja-con-nosotros')}>Trabaja con nosotros</button>
          <button className="um-nav-item" onClick={() => onNavigate('/ofertas')}>Ofertas</button>
          <button className="um-nav-item" onClick={() => onNavigate('/preguntas')}>Preguntas</button>
          <button className="um-nav-item" onClick={() => onNavigate('/ubicame')}>Ubícame</button>
        </nav>
        <div className="um-account-menu" ref={dropdownRef}>
          <button
            id="um-account-button"
            className="um-account-btn"
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-controls="um-account-dropdown"
            onClick={onToggleAccount}
          >
            <img src={UserIcon} alt="" aria-hidden="true" className="um-account-icon" decoding="async" />
            <span>Mi cuenta</span>
            <span className="um-chevron">{dropdownOpen ? '▲' : '▼'}</span>
          </button>
          <div id="um-account-dropdown" className={`um-dropdown ${dropdownOpen ? 'open' : ''}`} role="menu" aria-labelledby="um-account-button" aria-hidden={!dropdownOpen}>
            {role === 'CLIENTE' ? (
              <>
                <button className="um-dropdown-item" type="button" role="menuitem" onClick={() => { setDropdownOpen(false); onNavigate('/perfil') }}>
                  <img src={ProfileIcon} alt="" aria-hidden="true" className="um-dropdown-icon" decoding="async" />
                  <span>Perfil</span>
                </button>
                <button className="um-dropdown-item" type="button" role="menuitem" onClick={() => { setDropdownOpen(false); if (onLogout) onLogout() }}>
                  <img src={LogoutIcon} alt="" aria-hidden="true" className="um-dropdown-icon" decoding="async" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <button className="um-dropdown-item" type="button" role="menuitem" onClick={() => { setDropdownOpen(false); onNavigate('/login') }}>
                  <img src={LoginIcon} alt="" aria-hidden="true" className="um-dropdown-icon" decoding="async" />
                  <span>Iniciar sesión</span>
                </button>
                <button className="um-dropdown-item" type="button" role="menuitem" onClick={() => { setDropdownOpen(false); onNavigate('/perfil') }}>
                  <img src={ProfileIcon} alt="" aria-hidden="true" className="um-dropdown-icon" decoding="async" />
                  <span>Perfil</span>
                </button>
              </>
            )}
          </div>
        </div>
        <button className="um-cart" aria-label="Carrito" onClick={onCartClick} type="button">
          <img className="um-cart-icon" src={CartImage} alt="" aria-hidden="true" decoding="async" />
          <span className="um-cart-count" aria-label={`Artículos: ${cartCount}`}>{cartCount}</span>
        </button>
      </div>
      <div className="um-brand">
        <div className="um-search">
          <SearchBar value={query} onChange={onQueryChange} />
        </div>
      </div>
    </header>
  )
}
