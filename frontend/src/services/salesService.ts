import { supabase } from "./supabaseClient";
import { addCashMovement } from "./cashService";

export type SaleDetailItem = {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

/**
 * 🔥 CREA LA CABECERA DE VENTA
 * También registra movimiento de caja si el método es EFECTIVO
 */
export async function createSaleHeader(
  userId: string,
  total: number,
  method: string
) {
  const { data, error } = await supabase
    .from("sales_header")
    .insert({
      user_id: userId,
      total: total,
      payment_method: method,
    })
    .select()
    .single();

  if (error) throw error;

  // ⚡ SI ES PAGO EN EFECTIVO → SUMAR A CAJA AUTOMÁTICAMENTE
  if (method === "efectivo") {
    try {
      await addCashMovement(
        "ingreso",
        total,
        `Venta registrada (ID venta: ${data.id})`
      );
    } catch (e) {
      console.error("⚠ Error registrando movimiento de caja:", e);
    }
  }

  return data;
}

/**
 * Inserta muchos detalles en sales_detail
 */
export async function addSaleDetail(items: SaleDetailItem[]) {
  const { data, error } = await supabase
    .from("sales_detail")
    .insert(items);

  if (error) throw error;
  return data;
}

/**
 * Obtiene ventas del usuario
 */
export async function fetchMySalesHeaders(userId: string) {
  const { data, error } = await supabase
    .from("sales_header")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Obtiene detalles por IDs
 */
export async function fetchSalesDetailsBySaleIds(saleIds: string[]) {
  if (saleIds.length === 0) return [];

  const { data, error } = await supabase
    .from("sales_detail")
    .select("*")
    .in("sale_id", saleIds);

  if (error) throw error;
  return data;
}

/**
 * Ventas totales (para admin)
 */
export async function fetchAllSalesHeaders() {
  const { data, error } = await supabase
    .from("sales_header")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}
