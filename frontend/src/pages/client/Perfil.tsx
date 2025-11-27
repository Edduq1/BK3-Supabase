type Props = { user: { email: string; role: 'ADMIN' | 'CAJERO' | 'CLIENTE'; name?: string } | null }

export default function ClientPerfil({ user }: Props) {
  return (
    <section className="um-home">
      <h2>Perfil</h2>
      {user ? (
        <div>
          <div><strong>Nombre:</strong> {user.name || '-'}</div>
          <div><strong>Correo:</strong> {user.email}</div>
          <div><strong>Rol:</strong> {user.role}</div>
        </div>
      ) : (
        <p>No autenticado.</p>
      )}
    </section>
  )
}
