/**
 * LOAD — Etapa 3 do ETL
 * Insere os dados transformados no banco PostgreSQL
 * Usa UPSERT (INSERT ... ON CONFLICT) para evitar duplicatas:
 *   - Se o país já existe → atualiza os dados
 *   - Se não existe → insere um novo registro
 */
async function load(pool, data) {
  console.log(`[LOAD] Salvando ${data.length} registros no PostgreSQL...`)

  let loaded = 0

  for (const country of data) {
    await pool.query(
      `
      INSERT INTO countries
        (name, capital, population, region, subregion, area, languages, currencies, flag_url, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      ON CONFLICT (name) DO UPDATE SET
        capital    = EXCLUDED.capital,
        population = EXCLUDED.population,
        region     = EXCLUDED.region,
        subregion  = EXCLUDED.subregion,
        area       = EXCLUDED.area,
        languages  = EXCLUDED.languages,
        currencies = EXCLUDED.currencies,
        flag_url   = EXCLUDED.flag_url,
        updated_at = NOW()
      `,
      [
        country.name,
        country.capital,
        country.population,
        country.region,
        country.subregion,
        country.area,
        country.languages,
        country.currencies,
        country.flag_url,
      ]
    )
    loaded++
  }

  console.log(`[LOAD] ✅ ${loaded} registros salvos/atualizados no banco`)
  return loaded
}

module.exports = { load }
