export default function UbicamePage() {
  return (
    <section className="um-map" style={{ paddingTop: '1rem' }}>
      <h3>Ubícame</h3>
      <div className="um-map-box">
        <iframe title="Ubicación UrbanMarket" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.941920751597!2d-77.0428!3d-12.0464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8b1f4b0!2sLima!5e0!3m2!1ses-419!2spe!4v1700000000000" width="600" height="450" style={{ border: 0 }} allowFullScreen />
      </div>
    </section>
  )
}