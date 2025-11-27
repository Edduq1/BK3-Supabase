type Props = { onBack: () => void }
export default function TrabajaConNosotrosPage({ onBack }: Props) {
  return (
    <section className="um-work-page">
      <div className="um-work-hero">
        <h2>Trabaja con nosotros</h2>
        <p>Próximamente</p>
        <button className="um-cta-btn" onClick={onBack}>Volver al inicio</button>
      </div>
    </section>
  )
}