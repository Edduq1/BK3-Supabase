import SearchIcon from '../assets/iconos/simbolo-de-la-interfaz-de-busqueda.png'
type Props = { value: string; onChange: (v: string) => void }
export default function SearchBar({ value, onChange }: Props) {
  return (
    <form className="um-search-form" role="search">
      <input id="um-search-input" name="q" type="search" placeholder="¿Qué estás buscando?" aria-label="Buscar productos" value={value} onChange={(e) => onChange(e.target.value)} />
      <button className="um-search-btn" type="submit" aria-label="Buscar">
        <img src={SearchIcon} alt="" aria-hidden="true" className="um-search-icon" decoding="async" />
      </button>
    </form>
  )
}
