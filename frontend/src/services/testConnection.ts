import { supabase } from './supabaseClient';

export async function testSupabaseConnection() {
const { data, error } = await supabase
    .from('categories')
    .select('*')
    .limit(1);

if (error) {
    console.error('❌ ERROR conectando a Supabase:', error);
} else {
    console.log('✅ Conexión OK. Datos:', data);
}
}

export type SeedProduct = { name: string; price: number; category: string }

export const SEED_PRODUCTS: SeedProduct[] = [
  { name: 'Agua Mineral 625 ml', price: 10.5, category: 'Bebidas' },
  { name: 'Espumante Rubí 750 ml', price: 54.9, category: 'Bebidas' },
  { name: 'Cerveza Pack 6', price: 33.9, category: 'Bebidas' },
  { name: 'Refresco Cola 500 ml', price: 4.9, category: 'Bebidas' },
  { name: 'Soda Limón 1.5 L', price: 8.5, category: 'Bebidas' },
  { name: 'Jugo Naranja 1 L', price: 12.9, category: 'Bebidas' },
  { name: 'Jugo Natural Mix 300 ml', price: 6.5, category: 'Bebidas' },
  { name: 'Agua Saborizada 600 ml', price: 7.2, category: 'Bebidas' },
  { name: 'Bebida Energética 473 ml', price: 9.9, category: 'Bebidas' },
  { name: 'Isotónica 500 ml', price: 8.4, category: 'Bebidas' },
  { name: 'Vino Tinto Reserva 750 ml', price: 79.0, category: 'Bebidas' },
  { name: 'Papel Toalla 12un', price: 23.9, category: 'Limpieza' },
  { name: 'Detergente Ropa 1 kg', price: 18.5, category: 'Limpieza' },
  { name: 'Lavavajillas 750 ml', price: 9.5, category: 'Limpieza' },
  { name: 'Desinfectante Multiusos 1 L', price: 14.9, category: 'Limpieza' },
  { name: 'Limpiador de Piso 900 ml', price: 11.9, category: 'Limpieza' },
  { name: 'Jabón de Manos 250 ml', price: 7.9, category: 'Limpieza' },
  { name: 'Jabón Corporal 750 ml', price: 15.9, category: 'Limpieza' },
  { name: 'Kit Limpieza Hogar', price: 39.0, category: 'Limpieza' },
  { name: 'Ambientador Aerosol 200 ml', price: 8.5, category: 'Limpieza' },
  { name: 'Yogurt Light 390g', price: 6.9, category: 'Desayuno' },
  { name: 'Cereal Crujiente 500 g', price: 12.5, category: 'Desayuno' },
  { name: 'Granola 400 g', price: 14.0, category: 'Desayuno' },
  { name: 'Leche Entera 1 L', price: 5.5, category: 'Desayuno' },
  { name: 'Bebida Vegetal 1 L', price: 11.9, category: 'Desayuno' },
  { name: 'Mermelada de Fresa 250 g', price: 9.2, category: 'Desayuno' },
  { name: 'Mantequilla de Maní 340 g', price: 15.5, category: 'Desayuno' },
  { name: 'Pan Integral 500 g', price: 7.8, category: 'Desayuno' },
  { name: 'Café Molido 250 g', price: 19.9, category: 'Desayuno' },
  { name: 'Té Verde 20 u', price: 8.9, category: 'Desayuno' },
  { name: 'Gomitas Surtidas 130g', price: 9.7, category: 'Snacks' },
  { name: 'Papas Fritas 90 g', price: 6.0, category: 'Snacks' },
  { name: 'Nachos 200 g', price: 8.5, category: 'Snacks' },
  { name: 'Mix Frutos Secos 150 g', price: 18.9, category: 'Snacks' },
  { name: 'Semillas de Chía 250 g', price: 12.0, category: 'Snacks' },
  { name: 'Barra Energética 50 g', price: 5.5, category: 'Snacks' },
  { name: 'Galletas de Chocolate 120 g', price: 7.9, category: 'Snacks' },
  { name: 'Galletas Saladas 120 g', price: 6.9, category: 'Snacks' },
  { name: 'Chocolate Bitter 80 g', price: 11.5, category: 'Snacks' },
  { name: 'Caramelos Surtidos 150 g', price: 6.9, category: 'Snacks' },
  { name: 'Pasta Spaghetti 500 g', price: 7.5, category: 'Abarrotes' },
  { name: 'Arroz Superior 1 kg', price: 6.2, category: 'Abarrotes' },
  { name: 'Atún en Lata 170 g', price: 9.9, category: 'Abarrotes' },
  { name: 'Tomate Enlatado 400 g', price: 7.8, category: 'Abarrotes' },
  { name: 'Harina de Trigo 1 kg', price: 5.9, category: 'Abarrotes' },
  { name: 'Azúcar Rubia 1 kg', price: 4.9, category: 'Abarrotes' },
  { name: 'Pimienta Molida 50 g', price: 6.5, category: 'Abarrotes' },
  { name: 'Orégano 30 g', price: 4.0, category: 'Abarrotes' },
  { name: 'Aceite Vegetal 1 L', price: 16.9, category: 'Abarrotes' },
  { name: 'Aceite de Oliva 500 ml', price: 29.9, category: 'Abarrotes' },
  { name: 'Vinagre Blanco 500 ml', price: 6.9, category: 'Abarrotes' },
]

type RawCategoryRow = { id: string | number; name: string }

export async function seedProductsIfEmpty() {
  const { data: existingProducts, error: errP } = await supabase
    .from('products')
    .select('id')
    .limit(1)
  if (errP) throw errP
  if (Array.isArray(existingProducts) && existingProducts.length > 0) return

  const categoryNames = Array.from(new Set(SEED_PRODUCTS.map((p) => p.category)))
  const { data: catsData, error: errC } = await supabase
    .from('categories')
    .select('*')
  if (errC) throw errC
  const cats = Array.isArray(catsData) ? (catsData as RawCategoryRow[]) : []
  const byName = new Map<string, RawCategoryRow>(cats.map((c) => [String(c.name), c]))
  const toCreate = categoryNames.filter((n) => !byName.has(n)).map((name) => ({ name }))
  if (toCreate.length > 0) {
    const { data: createdCats, error: errCreate } = await supabase
      .from('categories')
      .insert(toCreate)
      .select('*')
    if (errCreate) throw errCreate
    const createdList = Array.isArray(createdCats) ? (createdCats as RawCategoryRow[]) : []
    for (const c of createdList) byName.set(String(c.name), c)
  }

  const rows = SEED_PRODUCTS.map((p) => ({
    name: p.name,
    price: p.price,
    category_id: byName.get(p.category) ? String(byName.get(p.category)!.id) : null,
    image_url: null,
  })).filter((r) => r.category_id !== null)

  if (rows.length > 0) {
    const { error: errIns } = await supabase
      .from('products')
      .insert(rows)
    if (errIns) throw errIns
  }
}
