import { useState } from 'react'
import { signUp } from '../../services/authService'
import { createUserProfile } from '../../services/userService'

type Props = { onNavigate: (p: string) => void }

export default function RegisterPage({ onNavigate }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOk('')
    try {
      const { user } = await signUp(email, password, name)
      if (user?.id) {
        try { await createUserProfile(user.id, email, name, 'CLIENTE') } catch {}
      }
      setOk('Cuenta creada. Revisa tu correo para verificar tu email.')
      setTimeout(() => onNavigate('/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando cuenta')
    }
  }

  return (
    <section className="um-home">
      <h2>Registro</h2>
      <form className="um-toolbar" onSubmit={onSubmit}>
        <input className="um-input" type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="um-input" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="um-input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="um-btn-primary" type="submit">Crear cuenta</button>
        {error && <div className="um-error">{error}</div>}
        {ok && <div style={{ color: 'var(--um-success)', fontWeight: 700 }}>{ok}</div>}
      </form>
    </section>
  )
}
