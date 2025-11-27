import { useEffect, useState } from 'react'
import type { Product } from '../types'
import carrusel1 from '../assets/carrusel/carrusel1.png'
import carrusel2 from '../assets/carrusel/carrusel2.png'
import carrusel3 from '../assets/carrusel/carrusel3.png'
import carrusel4 from '../assets/carrusel/carrusel4.png'
import carrusel5 from '../assets/carrusel/carrusel5.png'

type Props = { products: Product[]; categories: string[]; onViewCategory: (c: string) => void }
export default function InicioPage({ products, categories, onViewCategory }: Props) {
  const heroImages = [carrusel1, carrusel2, carrusel3, carrusel4, carrusel5]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [heroImages.length])

  useEffect(() => {
    const app = document.querySelector('.um-app')
    if (!app) return
    const sections = [
      { id: 'um-section-carrusel', scheme: 'scheme-hero' },
      { id: 'um-section-ofertas', scheme: 'scheme-ofertas' },
      { id: 'um-section-productos', scheme: 'scheme-productos' },
      { id: 'um-section-faq', scheme: 'scheme-faq' },
      { id: 'um-section-ubicame', scheme: 'scheme-ubicame' },
    ]
    const schemes = sections.map((s) => s.scheme)
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter((e) => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (top) {
        const found = sections.find((s) => s.id === (top.target as HTMLElement).id)
        if (found) {
          app.classList.remove(...schemes)
          app.classList.add(found.scheme)
        }
      }
    }, { threshold: 0.6 })
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  const offers = products.slice(0, 4).map((p) => ({ ...p, promo: Math.max(p.price * 0.85, 0) }))
  const faqs = [
    { q: '¿Cómo funcionan los envíos?', a: 'Realizamos envíos locales. El costo se calcula en el checkout.' },
    { q: '¿Puedo devolver mi pedido?', a: 'Sí, tienes 7 días para cambios o devoluciones según condiciones.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta y Yape. Pronto más opciones.' },
  ]

  return (
    <section className="um-home">
      <section id="um-section-carrusel" className="um-hero" role="region" aria-label="Carrusel destacado">
        <div className="um-hero-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {heroImages.map((src, i) => (
            <div className="um-hero-slide" key={i}><img src={src} alt="Destacado" loading="lazy" /></div>
          ))}
        </div>
        <div className="um-hero-controls">
          <button className="um-hero-btn" aria-label="Anterior" onClick={() => setIdx((idx - 1 + heroImages.length) % heroImages.length)}>◀</button>
          <button className="um-hero-btn" aria-label="Siguiente" onClick={() => setIdx((idx + 1) % heroImages.length)}>▶</button>
        </div>
        <div className="um-hero-dots" aria-label="Indicadores">
          {heroImages.map((_, i) => (
            <button key={i} className={i === idx ? 'um-dot active' : 'um-dot'} aria-label={`Ir a imagen ${i + 1}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </section>

      <section id="um-section-ofertas" className="um-offers">
        <h3>Ofertas</h3>
        <div className="um-offers-grid">
          {offers.map((p) => (
            <div key={p.id} className="um-offer-card">
              <img src={p.image} alt={p.name} loading="lazy" />
              <div className="um-offer-info">
                <div className="um-offer-name">{p.name}</div>
                <div className="um-offer-prices"><span className="um-offer-promo">S/ {p.promo.toFixed(2)}</span><span className="um-offer-old">S/ {p.price.toFixed(2)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="um-section-productos" className="um-categories">
        <h3>Productos por categorías</h3>
        <div className="um-cats-grid">
          {categories.map((c) => (
            <button key={c} className="um-cat-card" onClick={() => onViewCategory(c)}>
              <div className="um-cat-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e53935" /></svg></div>
              <div className="um-cat-title">{c}</div>
            </button>
          ))}
        </div>
      </section>

      <section id="um-section-faq" className="um-faq">
        <h3>Preguntas frecuentes</h3>
        <div className="um-accordion">
          {faqs.map((f, i) => (
            <div key={i} className={'um-acc-item'}>
              <button className="um-acc-toggle">{f.q}</button>
              <div className="um-acc-panel"><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="um-section-ubicame" className="um-map">
        <h3>Ubícame</h3>
        <div className="um-map-box">
          <iframe title="Ubicación UrbanMarket" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.941920751597!2d-77.0428!3d-12.0464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b1f4b0!2sLima!5e0!3m2!1ses-419!2spe!4v1700000000000" width="600" height="450" style={{ border: 0 }} allowFullScreen />
        </div>
      </section>
    </section>
  )
}
