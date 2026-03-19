function fmt(n) {
  return n != null ? Number(n).toLocaleString('pt-BR') : '—'
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR')
}

export default function ETLPanel({ onRun, running, result, logs }) {
  // Pega os contadores do último resultado para animar os steps
  const extracted   = result?.extracted
  const transformed = result?.transformed
  const loaded      = result?.loaded

  return (
    <div className="card">
      {/* Cabeçalho com botão */}
      <div className="etl-header">
        <div className="card-title">⚡ Pipeline ETL</div>
        <button className="btn btn-primary" onClick={onRun} disabled={running}>
          {running ? (
            <><div className="spinner" /> Executando...</>
          ) : (
            <>▶ Executar ETL</>
          )}
        </button>
      </div>

      {/* Visualização das 3 etapas */}
      <div className="etl-steps">
        <div className={`etl-step ${running ? 'active' : extracted != null ? 'success' : ''}`}>
          <span className="step-icon">🌐</span>
          <span className="step-label">Etapa 1</span>
          <span className="step-name">Extract</span>
          <span className="step-desc">Busca dados da API REST</span>
          {extracted != null && (
            <span className="step-count">✅ {fmt(extracted)} registros</span>
          )}
        </div>

        <div className="etl-arrow">→</div>

        <div className={`etl-step ${running ? 'active' : transformed != null ? 'success' : ''}`}>
          <span className="step-icon">⚙️</span>
          <span className="step-label">Etapa 2</span>
          <span className="step-name">Transform</span>
          <span className="step-desc">Limpa e formata os dados</span>
          {transformed != null && (
            <span className="step-count">✅ {fmt(transformed)} registros</span>
          )}
        </div>

        <div className="etl-arrow">→</div>

        <div className={`etl-step ${running ? 'active' : loaded != null ? 'success' : ''}`}>
          <span className="step-icon">💾</span>
          <span className="step-label">Etapa 3</span>
          <span className="step-name">Load</span>
          <span className="step-desc">Salva no PostgreSQL</span>
          {loaded != null && (
            <span className="step-count">✅ {fmt(loaded)} registros</span>
          )}
        </div>
      </div>

      {/* Resultado da última execução */}
      {result && (
        <div className={`etl-result ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <>
              ✅ <strong>ETL concluído</strong> em {result.duration} —{' '}
              {fmt(result.extracted)} extraídos → {fmt(result.transformed)} transformados → {fmt(result.loaded)} carregados
            </>
          ) : (
            <>❌ <strong>Erro:</strong> {result.error}</>
          )}
        </div>
      )}

      {/* Histórico de execuções */}
      {logs.length > 0 && (
        <div className="etl-logs">
          <div className="etl-logs-title">Histórico de execuções</div>
          <table className="logs-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Extraídos</th>
                <th>Transformados</th>
                <th>Carregados</th>
                <th>Duração</th>
                <th>Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className={`badge ${log.status}`}>
                      {log.status === 'success' ? '✅ Sucesso' : '❌ Erro'}
                    </span>
                  </td>
                  <td>{fmt(log.records_extracted)}</td>
                  <td>{fmt(log.records_transformed)}</td>
                  <td>{fmt(log.records_loaded)}</td>
                  <td>{log.duration || '—'}</td>
                  <td>{formatDate(log.executed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
