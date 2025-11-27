// src/services/cashService.ts
import { supabase } from './supabaseClient';

export type CashMovementType = 'apertura' | 'ingreso' | 'salida' | 'cierre';

export type CashMovement = {
  id: number;
  user_id: string;       // será el mismo que auth_user_id
  auth_user_id: string;  // id real del usuario Supabase Auth
  type: CashMovementType;
  amount: number;
  note: string | null;
  created_at: string;
};

// ===============================================
// 🔥 OBTENER EL ID REAL DEL USUARIO
async function getAuthUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
// ===============================================


// =================================================
// 🔹 Función genérica (ya NO recibe userId externo)
// =================================================
export async function addCashMovement(
  type: CashMovementType,
  amount: number,
  note?: string
) {
  const authUserId = await getAuthUserId();
  if (!authUserId) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from('cash_movements')
    .insert({
      user_id: authUserId,       // 👈 AMBOS CAMPOS IGUALES
      auth_user_id: authUserId,
      type,
      amount,
      note: note ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CashMovement;
}


// ===============================================
// 🔹 Versión POS (ya no recibe user_id)
// ===============================================
export async function registerCashMovement(params: {
  type: CashMovementType;
  amount: number;
  note?: string;
}) {
  const authUserId = await getAuthUserId();
  if (!authUserId) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from('cash_movements')
    .insert({
      user_id: authUserId,       // 👈 IGUAL QUE auth_user_id
      auth_user_id: authUserId,
      type: params.type,
      amount: params.amount,
      note: params.note ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CashMovement;
}


// ===============================================
// 🔹 Movimientos del usuario logueado
// ===============================================
export async function fetchMyMovements() {
  const authUserId = await getAuthUserId();
  if (!authUserId) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from('cash_movements')
    .select('*')
    .eq('user_id', authUserId)
    .order('id', { ascending: false });

  if (error) throw error;
  return data as CashMovement[];
}


// ===============================================
// 🔹 Todos los movimientos (solo admin)
// ===============================================
export async function fetchAllMovements() {
  const { data, error } = await supabase
    .from('cash_movements')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return data as CashMovement[];
}


// ===============================================
// 🔹 Helpers opcionales (ya NO reciben user_id)
// ===============================================
export async function registerCashIncome(
  amount: number,
  note: string
) {
  return registerCashMovement({
    type: 'ingreso',
    amount,
    note,
  });
}

export async function registerCashOutcome(
  amount: number,
  note: string
) {
  return registerCashMovement({
    type: 'salida',
    amount,
    note,
  });
}
