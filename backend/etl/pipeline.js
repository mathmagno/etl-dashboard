const { extract }   = require('./extract')
const { transform } = require('./transform')
const { load }      = require('./load')

/**
 * Pipeline ETL completo
 * Orquestra as 3 etapas em sequência e registra o resultado
 */
async function runETL(pool) {
  const startTime = Date.now()
  console.log('\n========== INICIANDO PIPELINE ETL ==========')

  try {
    // ── 1. EXTRACT ──────────────────────────────
    const rawData = await extract()

    // ── 2. TRANSFORM ────────────────────────────
    const transformedData = transform(rawData)

    // ── 3. LOAD ─────────────────────────────────
    const loaded = await load(pool, transformedData)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`========== ETL CONCLUÍDO em ${duration}s ==========\n`)

    // Registra execução bem-sucedida no log
    await pool.query(
      `INSERT INTO etl_logs (status, records_extracted, records_transformed, records_loaded, duration)
       VALUES ($1, $2, $3, $4, $5)`,
      ['success', rawData.length, transformedData.length, loaded, `${duration}s`]
    )

    return {
      extracted:   rawData.length,
      transformed: transformedData.length,
      loaded,
      duration:    `${duration}s`,
    }
  } catch (error) {
    console.error('[ETL ERROR]', error.message)

    // Registra execução com erro
    await pool.query(
      `INSERT INTO etl_logs (status, error_message, duration) VALUES ($1, $2, $3)`,
      ['error', error.message, `${((Date.now() - startTime) / 1000).toFixed(2)}s`]
    )

    throw error
  }
}

module.exports = { runETL }
