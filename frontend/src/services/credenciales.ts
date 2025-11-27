export type Role = 'ADMIN' | 'CAJERO' | 'CLIENTE'
export type User = { id: string; name: string; email: string; role: Role; password: string }

export const USERS: User[] = [
  { id: 'u1', name: 'Administrador', email: 'admin@urbanmarket.com', role: 'ADMIN', password: 'admin123' },
  { id: 'u2', name: 'Cajero', email: 'cajero@urbanmarket.com', role: 'CAJERO', password: 'cajero123' },
  { id: 'u3', name: 'Cliente', email: 'cliente@urbanmarket.com', role: 'CLIENTE', password: 'cliente123' },
]

export function login(email: string, password: string): User | null {
  const user = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  return user ?? null
}

