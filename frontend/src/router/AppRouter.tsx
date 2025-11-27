import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../types'
import Header from '../components/Header'
import CartModal from '../components/CartModal'
import AdminLayout from '../components/layouts/AdminLayout'
import CashierLayout from '../components/layouts/CashierLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminProductos from '../pages/admin/Productos'
import AdminCategorias from '../pages/admin/Categorias'
import AdminUsuarios from '../pages/admin/Usuarios'
import AdminReportesVentas from '../pages/admin/ReportesVentas'
import AdminReporteCaja from '../pages/admin/ReporteCaja'
import AdminHistorialVentas from '../pages/admin/HistorialVentas'
import AdminMovimientosCaja from '../pages/admin/MovimientosCaja'
import AdminConfiguracion from '../pages/admin/Configuracion'
import CashierPOS from '../pages/cajero/POS'
import CashierMisVentas from '../pages/cajero/MisVentas'
import CashierMovimientosCaja from '../pages/cajero/MovimientosCaja'
import CashierPerfil from '../pages/cajero/Perfil'
import LoginPage from '../pages/client/Login'
import RegisterPage from '../pages/client/Register'
import ClientPerfil from '../pages/client/Perfil'
import ClientPedidos from '../pages/client/Pedidos'
import { logout as supaLogout } from '../services/authService'
import { fetchActiveProducts } from '../services/productService'
import { fetchCategories } from '../services/categoryService'
import { supabase } from '../services/supabaseClient'
// Eliminado uso de assets locales y seed; ahora solo Supabase
import InicioPage from '../pages/inicio'
import ProductosPage from '../pages/productos'
import CheckoutPage from '../pages/checkout'
import TrabajaConNosotrosPage from '../pages/trabaja-con-nosotros'
import PreguntasPage from '../pages/preguntas'
import UbicamePage from '../pages/ubicame'
type RoleX = 'ADMIN' | 'CAJERO' | 'CLIENTE'

export const AuthContext = createContext<{ role: RoleX | null; user: { email: string; role: RoleX; name?: string } | null; setRole: (r: RoleX | null) => void; setUser: (u: { email: string; role: RoleX; name?: string } | null) => void }>({ role: null, user: null, setRole: () => {}, setUser: () => {} })
export function useAuth() { return useContext(AuthContext) }

function ProtectedRoute({ role, allowed, redirectTo, onNavigate, children }: { role: RoleX | null; allowed: RoleX[]; redirectTo: string; onNavigate: (p: string) => void; children: React.ReactNode }) {
  if (!role || !allowed.includes(role)) {
    setTimeout(() => onNavigate(redirectTo), 0)
    return null
  }
  return <>{children}</>
}

export function useRoleRedirect(onNavigate: (p: string) => void, setRole: (r: RoleX | null) => void, setUser: (u: { email: string; role: RoleX; name?: string } | null) => void) {
  const { role } = useAuth()
  useEffect(() => {
    ;(async () => {
      try {
        const { data: auth } = await supabase.auth.getUser()
        const authUser = auth.user
        if (!authUser?.id) return
        const { data, error } = await supabase
          .from('users')
          .select('email, role, name')
          .eq('auth_user_id', authUser.id)
          .single()
        if (error || !data) return
        const r = String(data.role).toLowerCase()
        const rUpper = r.toUpperCase() as RoleX
        setRole(rUpper)
        setUser({ email: String(data.email || authUser.email || ''), role: rUpper, name: data.name || authUser.user_metadata?.name })
        if (!role) {
          if (r === 'admin') onNavigate('/admin/dashboard')
          else if (r === 'cajero') onNavigate('/cajero/mis-ventas')
          else onNavigate('/perfil')
        }
      } catch {
        // noop
      }
    })()
  }, [])
}

export default function AppRouter() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cartOpen, setCartOpen] = useState(false)
  const [path, setPath] = useState<string>(typeof window !== 'undefined' ? window.location.pathname : '/')
  const [checkoutCategory, setCheckoutCategory] = useState('Todas')
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta' | 'Yape'>('Tarjeta')
  const [checkoutError] = useState<string | null>(null)
  const [role, setRole] = useState<RoleX | null>(null)
  const [userInfo, setUserInfo] = useState<{ email: string; role: RoleX; name?: string } | null>(null)
  const [cartItems, setCartItems] = useState<{ id: string; qty: number }[]>(() => {
    const raw = sessionStorage.getItem('um-cart')
    try { return raw ? JSON.parse(raw) : [] } catch { return [] }
  })

  const [storeProducts, setStoreProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [prodLoading, setProdLoading] = useState<boolean>(false)
  const [prodError, setProdError] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      setProdLoading(true); setProdError(null)
      try {
        const [prodRows, catRows] = await Promise.all([
          fetchActiveProducts(),
          fetchCategories() as Promise<{ id: string | number; name: string }[]>,
        ])
        const catMap = new Map<string, string>((catRows || []).map((c) => [String(c.id), String(c.name)]))
        const mapped: Product[] = (prodRows || []).map((r) => ({ id: String(r.id), name: String(r.name), price: Number(r.price), image: r.image_url || '', category: catMap.get(String(r.category_id)) || 'Sin categoría', stock: 999 }))
        setStoreProducts(mapped)
        setCategories((catRows || []).map((c) => String(c.name)))
      } catch (e: any) {
        console.error('Error cargando productos', e)
        setProdError(e?.message || 'Error cargando productos')
        setStoreProducts([])
        setCategories([])
      } finally {
        setProdLoading(false)
      }
    })()
  }, [])
  useRoleRedirect(navigate, setRole, setUserInfo)
  const productsById = useMemo(() => Object.fromEntries(storeProducts.map((p) => [p.id, p])), [storeProducts])
  useEffect(() => { setCartItems((items) => items.filter((it) => !!productsById[it.id])) }, [productsById])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return storeProducts.filter((p) => (q ? p.name.toLowerCase().includes(q) : true) && (selectedCategory === 'Todos' ? true : p.category === selectedCategory))
  }, [storeProducts, query, selectedCategory])

  function addToCart(p: Product) {
    setCartItems((items) => {
      const existing = items.find((it) => it.id === p.id)
      if (existing) return items.map((it) => it.id === p.id ? { ...it, qty: Math.min(it.qty + 1, p.stock) } : it)
      return [...items, { id: p.id, qty: 1 }]
    })
  }
  function incQty(id: string) { const p = productsById[id]; setCartItems((items) => items.map((it) => it.id === id ? { ...it, qty: Math.min(it.qty + 1, p.stock) } : it)) }
  function decQty(id: string) { setCartItems((items) => items.map((it) => it.id === id ? { ...it, qty: Math.max(it.qty - 1, 1) } : it)) }
  function removeItem(id: string) { setCartItems((items) => items.filter((it) => it.id !== id)) }
  function restoreItem(id: string, qty: number) {
    const p = productsById[id]
    setCartItems((items) => {
      const exists = items.find((it) => it.id === id)
      if (exists) return items.map((it) => it.id === id ? { ...it, qty: Math.min(qty, p.stock) } : it)
      return [...items, { id, qty: Math.min(qty, p.stock) }]
    })
  }

  useEffect(() => { sessionStorage.setItem('um-cart', JSON.stringify(cartItems)) }, [cartItems])

  function goCheckout() { setCartOpen(false); navigate('/checkout') }

  const subtotal = useMemo(() => cartItems.reduce((sum, it) => {
    const p = productsById[it.id]
    return sum + (p ? p.price * it.qty : 0)
  }, 0), [cartItems, productsById])
  const TAX_RATE = 0.0
  const tax = useMemo(() => subtotal * TAX_RATE, [subtotal])
  const shipping = useMemo(() => (subtotal > 80 ? 0 : 10), [subtotal])
  const total = useMemo(() => subtotal + tax + shipping, [subtotal, tax, shipping])
  const cartCount = useMemo(() => cartItems.reduce((a,b)=>a+b.qty,0), [cartItems])
  // El rol se establece desde Login


  function navigate(to: string) { window.history.pushState(null, '', to); setPath(to) }
  function onLogin(u: { role: RoleX; email: string; name?: string }) { setRole(u.role); setUserInfo(u) }
  async function onLogout() { await supaLogout(); setRole(null); setUserInfo(null); navigate('/') }
  useEffect(() => { const fn = () => setPath(window.location.pathname); window.addEventListener('popstate', fn); return () => window.removeEventListener('popstate', fn) }, [])
  useEffect(() => { if (path === '/ofertas') { setTimeout(() => { const el = document.getElementById('um-section-ofertas'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 0) } }, [path])

  if (path.startsWith('/admin')) {
    return (
      <AuthContext.Provider value={{ role, user: userInfo, setRole, setUser: setUserInfo }}>
      <ProtectedRoute role={role} allowed={["ADMIN"]} redirectTo="/inicio" onNavigate={navigate}>
        <AdminLayout onNavigate={navigate} onLogout={onLogout}>
          {path === '/admin/dashboard' ? (
            <AdminDashboard />
          ) : path === '/admin/productos' ? (
            <AdminProductos />
          ) : path === '/admin/categorias' ? (
            <AdminCategorias />
          ) : path === '/admin/usuarios' ? (
            <AdminUsuarios />
          ) : path === '/admin/reportes-ventas' ? (
            <AdminReportesVentas />
          ) : path === '/admin/reporte-caja' ? (
            <AdminReporteCaja />
          ) : path === '/admin/historial-ventas' ? (
            <AdminHistorialVentas />
          ) : path === '/admin/movimientos-caja' ? (
            <AdminMovimientosCaja />
          ) : path === '/admin/configuracion' ? (
            <AdminConfiguracion />
          ) : (
            <AdminDashboard />
          )}
        </AdminLayout>
      </ProtectedRoute>
      </AuthContext.Provider>
    )
  }

  if (path.startsWith('/cajero')) {
    return (
      <AuthContext.Provider value={{ role, user: userInfo, setRole, setUser: setUserInfo }}>
      <ProtectedRoute role={role} allowed={["CAJERO"]} redirectTo="/" onNavigate={navigate}>
      <CashierLayout onNavigate={navigate} onLogout={onLogout}>
        {path === '/cajero/pos' ? (
          <CashierPOS />
        ) : path === '/cajero/mis-ventas' ? (
          <CashierMisVentas />
        ) : path === '/cajero/movimientos-caja' ? (
          <CashierMovimientosCaja />
        ) : path === '/cajero/perfil' ? (
          <CashierPerfil />
        ) : (
          <CashierPOS />
        )}
      </CashierLayout>
      </ProtectedRoute>
      </AuthContext.Provider>
    )
  }

  return (
    <div className="um-app">
      <Header cartCount={cartCount} query={query} onQueryChange={setQuery} onCartClick={() => setCartOpen(true)} onNavigate={navigate} role={role} onLogout={onLogout} />
      <main className="um-content">
        {path === '/' || path === '/ofertas' || path === '/inicio' ? (
          <InicioPage products={storeProducts} categories={categories} onViewCategory={(c) => { setSelectedCategory(c); navigate('/productos') }} />
        ) : path === '/productos' ? (
          prodLoading ? (
            <div className="um-home" style={{ padding: '1rem' }}>Cargando productos...</div>
          ) : prodError ? (
            <div className="um-home" style={{ padding: '1rem' }}>Error: {prodError}</div>
          ) : (
            <ProductosPage products={filtered} categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} quantities={Object.fromEntries(cartItems.map((it)=>[it.id,it.qty]))} onAdd={addToCart} onInc={incQty} onDec={decQty} />
          )
        ) : path === '/checkout' ? (
          <CheckoutPage items={cartItems} productsById={productsById} categories={categories} selectedCategory={checkoutCategory} onSelectCategory={setCheckoutCategory} onInc={incQty} onDec={decQty} subtotal={subtotal} tax={tax} shipping={shipping} total={total} paymentMethod={paymentMethod} onPaymentChange={setPaymentMethod} error={checkoutError} onBack={() => navigate('/productos')} />
        ) : path === '/trabaja-con-nosotros' ? (
          <TrabajaConNosotrosPage onBack={() => navigate('/')} />
        ) : path === '/preguntas' ? (
          <PreguntasPage />
        ) : path === '/ubicame' ? (
          <UbicamePage />
        ) : path === '/login' ? (
          <LoginPage onLogin={onLogin} onNavigate={navigate} />
        ) : path === '/registro' ? (
          <RegisterPage onNavigate={navigate} />
        ) : path === '/perfil' ? (
          <ClientPerfil user={userInfo} />
        ) : path === '/pedidos' ? (
          <ClientPedidos />
        ) : (
          <InicioPage products={storeProducts} categories={categories} onViewCategory={(c) => { setSelectedCategory(c); navigate('/productos') }} />
        )}
      </main>
      <CartModal items={cartItems} productsById={productsById} open={cartOpen} onClose={() => setCartOpen(false)} onInc={incQty} onDec={decQty} onRemove={removeItem} onRestore={restoreItem} onCheckout={goCheckout} />
    </div>
  )
}
