const REGIONS = ['Africa', 'Americas', 'Antarctic', 'Asia', 'Europe', 'Oceania']

function fmtPop(n) {
  if (!n) return '0'
  const num = Number(n)
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B'
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000)         return (num / 1_000).toFixed(0) + 'K'
  return num.toLocaleString('pt-BR')
}

function fmtArea(n) {
  if (!n) return '—'
  return Number(n).toLocaleString('pt-BR') + ' km²'
}

// Barra de progresso proporcional à maior população
const MAX_POP = 1_400_000_000

export default function CountriesTable({
  countries, loading, search, onSearch, regionFilter, onRegionFilter
}) {
  return (
    <div className="card">
      <div className="table-header">
        <div className="card-title" style={{ marginBottom: 0 }}>
          📋 Países
        </div>
        <div className="table-filters">
          <input
            className="input-search"
            type="text"
            placeholder="🔍  Buscar por nome ou capital..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <select
            className="input-select"
            value={regionFilter}
            onChange={(e) => onRegionFilter(e.target.value)}
          >
            <option value="">Todas as regiões</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <span className="table-count">{countries.length} resultado(s)</span>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>País</th>
              <th>Capital</th>
              <th>Região</th>
              <th>Sub-região</th>
              <th>População</th>
              <th>Área</th>
              <th>Moeda</th>
              <th>Idioma(s)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton de carregamento
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="loading-row">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ width: j === 0 ? '80%' : '60%' }} /></td>
                  ))}
                </tr>
              ))
            ) : countries.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  Nenhum país encontrado com os filtros atuais.
                </td>
              </tr>
            ) : (
              countries.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flag-cell">
                      {c.flag_url && (
                        <img className="flag-img" src={c.flag_url} alt={`Bandeira de ${c.name}`} />
                      )}
                      <span className="country-name">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.capital || '—'}</td>
                  <td>{c.region || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{c.subregion || '—'}</td>
                  <td>
                    <div className="pop-bar-wrap">
                      <div
                        className="pop-bar"
                        style={{ width: `${Math.min(100, (c.population / MAX_POP) * 100)}%`, maxWidth: 80 }}
                      />
                      <span className="pop-value">{fmtPop(c.population)}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{fmtArea(c.area)}</td>
                  <td style={{ fontSize: '.8rem' }}>{c.currencies || '—'}</td>
                  <td style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>{c.languages || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
