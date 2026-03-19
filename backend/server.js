require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { Pool } = require('pg')
const { runETL } = require('./etl/pipeline')

const app = express()
app.use(cors())
app.use(express.json())

// Conexão com o banco de dados PostgreSQL
// Em produção (Railway) usa DATABASE_URL; em desenvolvimento usa variáveis individuais
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'etluser',
      password: process.env.DB_PASS || 'etlpass',
      database: process.env.DB_NAME || 'etldb',
    })

// Cria as tabelas se não existirem
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(150) UNIQUE NOT NULL,
      capital    VARCHAR(150),
      population BIGINT,
      region     VARCHAR(80),
      subregion  VARCHAR(150),
      area       NUMERIC,
      languages  TEXT,
      currencies TEXT,
      flag_url   TEXT,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS etl_logs (
      id                  SERIAL PRIMARY KEY,
      status              VARCHAR(20),
      records_extracted   INT,
      records_transformed INT,
      records_loaded      INT,
      duration            VARCHAR(20),
      error_message       TEXT,
      executed_at         TIMESTAMP DEFAULT NOW()
    );
  `)
  console.log('✅ Banco de dados inicializado')
}

// ─── ROTAS ───────────────────────────────────────────────────────────────────

// Executa o pipeline ETL completo
app.post('/api/etl/run', async (req, res) => {
  try {
    const result = await runETL(pool)
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Retorna histórico de execuções ETL
app.get('/api/etl/logs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM etl_logs ORDER BY executed_at DESC LIMIT 10'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Retorna lista de países com filtros opcionais
app.get('/api/countries', async (req, res) => {
  try {
    const { search, region } = req.query
    let query = 'SELECT * FROM countries'
    const params = []
    const conditions = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(name ILIKE $${params.length} OR capital ILIKE $${params.length})`)
    }
    if (region) {
      params.push(region)
      conditions.push(`region = $${params.length}`)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    query += ' ORDER BY name'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Retorna estatísticas gerais
app.get('/api/stats', async (req, res) => {
  try {
    const summary = await pool.query(`
      SELECT
        COUNT(*)                           AS total_countries,
        SUM(population)                    AS total_population,
        COUNT(DISTINCT region)             AS total_regions,
        ROUND(AVG(population))             AS avg_population,
        MAX(updated_at)                    AS last_updated
      FROM countries
    `)
    const byRegion = await pool.query(`
      SELECT region, COUNT(*) AS count
      FROM countries
      GROUP BY region
      ORDER BY count DESC
    `)
    res.json({ ...summary.rows[0], by_region: byRegion.rows })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── FRONTEND ESTÁTICO (produção) ─────────────────────────────────────────────
const frontendDist = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendDist))
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'))
})

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend rodando em http://localhost:${PORT}`)
  })
})
