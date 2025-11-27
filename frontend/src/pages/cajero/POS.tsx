// ---------------------
// POS DEL CAJERO - COMPLETO
// CON REGISTRO CORRECTO DE CAJA (solo EFECTIVO)
// ---------------------

import { useEffect, useMemo, useState } from 'react'
import { fetchProductsWithCategories } from '../../services/productService'
import { fetchCategories } from '../../services/categoryService'
import { createSaleHeader, addSaleDetail } from '../../services/salesService'
import { getCurrentUserRow } from '../../services/userService'
import { addCashMovement } from '../../services/cashService'
import type { Product } from '../../types'

type PayMethod = 'efectivo' | 'yape' | 'tarjeta'
type CartItem = { id: string; qty: number }

// =====================================================
// BARRA SUPERIOR
// =====================================================
function TopBar({
  cashier,
  onNavigate,
  onLogout
}: {
  cashier: string
  onNavigate: (to: string) => void
  onLogout: () => void
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>POS del cajero</h2>
        <span
          style={{
            background: 'var(--um-bg)',
            border: '1px solid var(--um-border)',
            borderRadius: 999,
            padding: '0.25rem 0.6rem'
          }}
        >
          {cashier}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="um-btn-secondary" onClick={() => onNavigate('/cajero/pos')}>
          POS
        </button>
        <button className="um-btn-secondary" onClick={() => onNavigate('/cajero/mis-ventas')}>
          Mis ventas
        </button>
        <button
          className="um-btn-secondary"
          onClick={() => onNavigate('/cajero/movimientos-caja')}
        >
          Movimientos de caja
        </button>
        <button className="um-btn-secondary" onClick={() => onNavigate('/cajero/perfil')}>
          Perfil
        </button>
        <button className="um-btn-primary" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// =====================================================
// POS PRINCIPAL
// =====================================================
export default function CashierPOS() {
  const [cashierName, setCashierName] = useState('Cajero')
  const [products, setProducts] = useState<Product[]>([])
  const productsById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p])),
    [products]
  )

  const [categories, setCategories] = useState<string[]>([])
  void categories.length

  // Cargar productos, categorías y usuario
  useEffect(() => {
    ;(async () => {
      try {
        const user = await getCurrentUserRow()
        if (user) setCashierName(`Cajero: ${user.email}`)

        const cats = await fetchCategories()
        const catMap = new Map<string, string>(
          cats.map((c: any) => [String(c.id), String(c.name)])
        )

        const rows = await fetchProductsWithCategories()
        const mapped: Product[] = rows.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          price: Number(r.price),
          image: r.image_url,
          category: catMap.get(String(r.category_id)) || 'Sin categoría',
          stock: 999
        }))

        setProducts(mapped)
        setCategories(Array.from(new Set(mapped.map((p) => p.category))))
      } catch (e) {
        console.error('Error cargando productos/categorías', e)
      }
    })()
  }, [])

  // =====================================================
  // CARRITO
  // =====================================================
  const [items, setItems] = useState<CartItem[]>([])

  function add(p: Product) {
    setItems((xs) =>
      xs.find((it) => it.id === p.id) ? xs : [...xs, { id: p.id, qty: 1 }]
    )
  }
  void add

  function inc(id: string) {
    setItems((xs) =>
      xs.map((it) => (it.id === id ? { ...it, qty: it.qty + 1 } : it))
    )
  }
  void inc

  function dec(id: string) {
    setItems((xs) =>
      xs.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it
      )
    )
  }
  void dec

  function remove(id: string) {
    setItems((xs) => xs.filter((it) => it.id !== id))
  }
  void remove

  const [method, setMethod] = useState<PayMethod>('efectivo')
  void setMethod
  const [cash, setCash] = useState('')

  // =====================================================
  // FINALIZAR VENTA
  // =====================================================
  async function finishSale() {
    try {
      const user = await getCurrentUserRow()
      if (!user) return alert('No autenticado')

      const subtotal = items.reduce(
        (sum, it) => sum + productsById[it.id].price * it.qty,
        0
      )
      const igv = subtotal * 0.18
      const total = subtotal + igv

      // Validación de efectivo
      if (method === 'efectivo') {
        if (Number(cash) < total) return alert('Monto insuficiente')
      }

      // 1️⃣ Crear cabecera
      const header = await createSaleHeader(String(user.id), total, method)

      // 2️⃣ Crear detalle
      const details = items.map((it) => ({
        sale_id: header.id,
        product_id: it.id,
        quantity: it.qty,
        unit_price: productsById[it.id].price,
        subtotal: productsById[it.id].price * it.qty
      }))
      await addSaleDetail(details)

      // 3️⃣ SOLO registrar cash_movements si el método es EFECTIVO
      if (method === 'efectivo') {
        await addCashMovement('ingreso', total, `Venta #${header.id}`)
      }

      alert(
        `Venta finalizada ✔\nTicket: ${header.id}\nTotal: S/ ${total.toFixed(
          2
        )}\nMétodo: ${method}`
      )

      // limpiar
      setItems([])
      setCash('')
    } catch (e: any) {
      console.error(e)
      alert(e.message || 'Error realizando venta')
    }
  }

  function navigate(to: string) {
    window.history.pushState(null, '', to)
    window.dispatchEvent(new Event('popstate'))
  }

  async function logout() {
    const { logout } = await import('../../services/authService')
    await logout()
    navigate('/')
  }

  return (
    <section className="um-home" style={{ display: 'grid', gap: '0.75rem' }}>
      <TopBar cashier={cashierName} onNavigate={navigate} onLogout={logout} />

      {/* tu UI original del POS va aquí */}

      <button
        className="um-btn-primary um-checkout-btn"
        onClick={finishSale}
        style={{ marginTop: '1rem' }}
      >
        Finalizar venta
      </button>
    </section>
  )
}
