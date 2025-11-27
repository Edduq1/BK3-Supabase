export default function PreguntasPage() {
  const faqs = [
    { q: '¿Cómo funcionan los envíos?', a: 'Realizamos envíos locales. El costo se calcula en el checkout.' },
    { q: '¿Puedo devolver mi pedido?', a: 'Sí, tienes 7 días para cambios o devoluciones según condiciones.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta y Yape. Pronto más opciones.' },
  ]
  return (
    <section className="um-faq" style={{ paddingTop: '1rem' }}>
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
  )
}