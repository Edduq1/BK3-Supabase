import { useState } from 'react'
import { login as supaLogin } from '../../services/authService'
import { supabase } from '../../services/supabaseClient'

type Props = { onLogin: (u: { role: 'ADMIN' | 'CAJERO' | 'CLIENTE'; email: string; name?: string }) => void; onNavigate: (p: string) => void }

export default function LoginPage({ onLogin, onNavigate }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { user } = (await supaLogin(email, password)).session ?? {}
      if (!user) { setError('Credenciales inválidas'); return }
      const { data, error } = await supabase
        .from('users')
        .select('role,name,email')
        .eq('auth_user_id', user.id)
        .single()
      if (error || !data?.role) { setError('Rol no encontrado'); return }
      const roleLower = String(data.role).toLowerCase()
      const roleUpper = roleLower.toUpperCase() as 'ADMIN' | 'CAJERO' | 'CLIENTE'
      onLogin({ role: roleUpper, email: String(data.email || email), name: data.name })
      if (roleLower === 'admin') onNavigate('/admin/dashboard')
      else if (roleLower === 'cajero') onNavigate('/cajero/mis-ventas')
      else onNavigate('/perfil')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
    }
  }

  return (
    <section className="um-home">
      <h2>Iniciar sesión</h2>
      <form className="um-toolbar" onSubmit={onSubmit}>
        <input className="um-input" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="um-input" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="um-btn-primary" type="submit">Entrar</button>
        {error && <div className="um-error">{error}</div>}
        <button className="um-btn-secondary" type="button" onClick={() => onNavigate('/registro')}>Crear cuenta</button>
      </form>
    </section>
  )
}
