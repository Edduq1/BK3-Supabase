import type { Product } from '../types';
import { supabase } from '../services/supabaseClient';

// Servicios
import { createSaleHeader, addSaleDetail } from '../services/salesService';

type Props = {
  items: { id: string; qty: number }[];
  productsById: Record<string, Product>;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (c: string) => void;
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: 'Tarjeta' | 'Yape';
  onPaymentChange: (m: 'Tarjeta' | 'Yape') => void;
  error: string | null;
  onBack: () => void;
};

export default function CheckoutPage({
  items,
  productsById,
  categories,
  selectedCategory,
  onSelectCategory,
  onInc,
  onDec,
  subtotal,
  tax,
  shipping,
  total,
  paymentMethod,
  onPaymentChange,
  error,
  onBack,
}: Props) {

  const allCats = ['Todas', ...categories];

  const filteredItems = items.filter((it) => {
    const p = productsById[it.id];
    if (!p) return false;
    return selectedCategory === 'Todas' ? true : p.category === selectedCategory;
  });

  // ===============================
  // FINALIZAR COMPRA (checkout)
  // ===============================
  const handlePlaceOrder = async () => {
    try {
      // 1. Usuario autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Debes iniciar sesión para realizar la compra");
        return;
      }

      if (items.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }

      // 2. Preparar detalle
      const cartItems = items.map((it) => {
        const p = productsById[it.id];
        return {
          product_id: it.id,
          quantity: it.qty,
          unit_price: p.price,
          subtotal: p.price * it.qty,
        };
      });

      // 3. Crear cabecera
      const header = await createSaleHeader(
        user.id,
        total,
        paymentMethod === "Tarjeta" ? "tarjeta" : "yape"
      );

      // 4. Insertar detalles
      const detailRows = cartItems.map((d) => ({
        ...d,
        sale_id: header.id
      }));

      await addSaleDetail(detailRows);

      alert("Compra registrada correctamente ✔");

    } catch (err: any) {
      console.error(err);
      alert("Error al finalizar pedido");
    }
  };

  return (
    <section className="um-checkout">
      <div className="um-checkout-header">
        <button className="um-btn-secondary" onClick={onBack}>Volver</button>
        <h2>Mi carrito</h2>
      </div>

      {/* Categorías */}
      <div className="um-checkout-cats">
        {allCats.map((c) => {
          const count = items
            .filter((it) =>
              c === 'Todas' ? true : productsById[it.id].category === c
            )
            .reduce((a, b) => a + b.qty, 0);

          return (
            <button
              key={c}
              className={c === selectedCategory ? 'um-cat active' : 'um-cat'}
              onClick={() => onSelectCategory(c)}
            >
              <span className="um-cat-name">{c}</span>
              <span className="um-cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="um-checkout-layout">
        {/* Lista */}
        <div className="um-checkout-list">
          <div className="um-list-header">
            <span>Producto</span>
            <span>Precio</span>
            <span>Cantidad</span>
            <span>Total</span>
          </div>

          {filteredItems.map((it) => {
            const p = productsById[it.id];
            if (!p) return null;

            const rowTotal = p.price * it.qty;

            return (
              <div className="um-list-row" key={it.id}>
                <div className="um-list-product">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <div className="um-list-name">{p.name}</div>
                </div>

                <div className="um-list-price">S/ {p.price.toFixed(2)}</div>

                <div className="um-list-qty">
                  <button
                    className="um-qty-btn"
                    onClick={() => onDec(p.id)}
                    disabled={it.qty <= 1}
                  >−</button>

                  <span className="um-qty-value">{it.qty}</span>

                  <button
                    className="um-qty-btn"
                    onClick={() => onInc(p.id)}
                    disabled={it.qty >= p.stock}
                  >+</button>
                </div>

                <div className="um-list-total">
                  S/ {rowTotal.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <aside className="um-checkout-summary">
          <div className="um-summary-box">
            <div className="um-summary-row">
              <span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="um-summary-row">
              <span>Impuestos</span><span>S/ {tax.toFixed(2)}</span>
            </div>
            <div className="um-summary-row">
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}</span>
            </div>
            <div className="um-summary-row strong">
              <span>Total</span><span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="um-pay-box">
            <div className="um-pay-title">Método de pago</div>

            <label className="um-radio">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'Tarjeta'}
                onChange={() => onPaymentChange('Tarjeta')}
              /> Tarjeta
            </label>

            <label className="um-radio">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'Yape'}
                onChange={() => onPaymentChange('Yape')}
              /> Yape
            </label>
          </div>

          {error && <div className="um-error">{error}</div>}

          <button
            className="um-btn-primary um-checkout-btn"
            onClick={handlePlaceOrder}
          >
            Finalizar pedido
          </button>
        </aside>
      </div>
    </section>
  );
}
