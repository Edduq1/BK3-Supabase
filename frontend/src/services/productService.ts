import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchProductsWithCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,category_id,image_url')
    .order('id', { ascending: true })
  if (error) throw error
  return data
}

export function useProducts() {
  const [rows, setRows] = useState<{ id: string | number; name: string; price: number | string; category_id: string | number | null; image_url: string | null; is_active: boolean; created_at: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('id', { ascending: true })
        if (error) throw error
        setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando productos')
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  return { rows, loading, error }
}

export async function fetchActiveProductsJoined() {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,image_url,category_id,categories(name)')
    .eq('is_active', true)
    .order('id', { ascending: true })
  if (error) throw error
  return data as any[]
}

export async function fetchActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,price,image_url,category_id,is_active')
    .eq('is_active', true)
    .order('id', { ascending: true })
  if (error) throw error
  return (Array.isArray(data) ? data : []) as { id: string | number; name: string; price: number | string; image_url: string | null; category_id: string | number | null; is_active: boolean }[]
}
