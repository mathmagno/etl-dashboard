function fmtNum(n) {
  if (!n) return '0'
  const num = Number(n)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + 'K'
  return num.toLocaleString('pt-BR')
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

export default function StatsCards({ stats }) {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🌍</div>
          <div>
            <div className="stat-value">{fmtNum(stats.total_countries)}</div>
            <div className="stat-label">Países no banco</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div>
            <div className="stat-value">{fmtNum(stats.total_population)}</div>
            <div className="stat-label">População total</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">🗺️</div>
          <div>
            <div className="stat-value">{stats.total_regions}</div>
            <div className="stat-label">Regiões geográficas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">📅</div>
          <div>
            <div className="stat-value" style={{ fontSize: '1.1rem' }}>{fmtDate(stats.last_updated)}</div>
            <div className="stat-label">Última atualização</div>
          </div>
        </div>
      </div>

      {/* Distribuição por região */}
      {stats.by_region?.length > 0 && (
        <div>
          <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Países por região
          </div>
          <div className="region-pills">
            {stats.by_region.map((r) => (
              <span key={r.region} className="region-pill">
                {r.region} <strong>{r.count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
