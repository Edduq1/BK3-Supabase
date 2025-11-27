import { supabase } from './supabaseClient'

export async function getUserRole(authUserId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('auth_user_id', authUserId)
    .single()

  if (error) throw error
  return data.role
}

export async function getCurrentUserRow() {
  // Obtener usuario autenticado
  const { data: auth, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError

  const authId = auth.user?.id
  if (!authId) return null

  // Buscar profile en la tabla users
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', authId)
    .maybeSingle()           // ← evita que lance error si no existe

  if (error) throw error

  // Si no existe profile, retornar null
  return data ?? null
}

export async function listUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('email', { ascending: true })

  if (error) throw error
  return data
}

export async function createUserProfile(
  authUserId: string,
  email: string,
  name?: string,
  role: 'ADMIN' | 'CAJERO' | 'CLIENTE' = 'CLIENTE'
) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      auth_user_id: authUserId,
      email,
      name: name || '',
      role,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}
