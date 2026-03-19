import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ETLPanel from './components/ETLPanel'
import StatsCards from './components/StatsCards'
import CountriesTable from './components/CountriesTable'

function App() {
  const [countries, setCountries]     = useState([])
  const [stats, setStats]             = useState(null)
  const [etlLogs, setEtlLogs]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [etlRunning, setEtlRunning]   = useState(false)
  const [etlResult, setEtlResult]     = useState(null)
  const [search, setSearch]           = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  // Busca todos os dados do backend
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (regionFilter) params.set('region', regionFilter)

      const [countriesRes, statsRes, logsRes] = await Promise.all([
        fetch(`/api/countries?${params}`),
        fetch('/api/stats'),
        fetch('/api/etl/logs'),
      ])

      setCountries(await countriesRes.json())
      setStats(await statsRes.json())
      setEtlLogs(await logsRes.json())
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }, [search, regionFilter])

  // Executa o pipeline ETL
  const runETL = async () => {
    setEtlRunning(true)
    setEtlResult(null)
    try {
      const res  = await fetch('/api/etl/run', { method: 'POST' })
      const data = await res.json()
      setEtlResult(data)
      await fetchData() // Atualiza os dados após o ETL
    } catch (err) {
      setEtlResult({ success: false, error: err.message })
    } finally {
      setEtlRunning(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const isEmpty = !loading && countries.length === 0 && !search && !regionFilter

  return (
    <div className="app">
      <Header />

      <main className="main">
        <ETLPanel
          onRun={runETL}
          running={etlRunning}
          result={etlResult}
          logs={etlLogs}
        />

        {stats && Number(stats.total_countries) > 0 && (
          <StatsCards stats={stats} />
        )}

        {isEmpty ? (
          <div className="empty-state">
            <span className="empty-icon">🗄️</span>
            <h2>Banco de dados vazio</h2>
            <p>Clique em <strong>"Executar ETL"</strong> acima para importar os dados dos países do mundo.</p>
          </div>
        ) : (
          <CountriesTable
            countries={countries}
            loading={loading}
            search={search}
            onSearch={setSearch}
            regionFilter={regionFilter}
            onRegionFilter={setRegionFilter}
          />
        )}
      </main>
    </div>
  )
}

export default App
