export default function Header() {
  return (
    <header className="header">
      <span className="header-icon">🌍</span>
      <div>
        <h1>ETL Dashboard</h1>
        <p>Extract · Transform · Load — Países do Mundo</p>
      </div>
      <span className="header-badge">restcountries.com → PostgreSQL</span>
    </header>
  )
}
