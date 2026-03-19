/**
 * TRANSFORM — Etapa 2 do ETL
 * Recebe os dados brutos da API e:
 *  - Seleciona apenas os campos relevantes
 *  - Limpa e normaliza os valores
 *  - Converte estruturas aninhadas em strings simples
 *  - Remove registros inválidos
 */
function transform(rawData) {
  console.log(`[TRANSFORM] Processando ${rawData.length} registros...`)

  const transformed = rawData
    .map((country) => {
      // Moedas: { BRL: { name: "Brazilian real" } } → "Brazilian real"
      const currencies = country.currencies
        ? Object.values(country.currencies)
            .map((c) => c.name)
            .join(', ')
        : 'N/A'

      // Idiomas: { por: "Portuguese" } → "Portuguese"
      const languages = country.languages
        ? Object.values(country.languages).join(', ')
        : 'N/A'

      // Capital pode ser um array, pega o primeiro elemento
      const capital = Array.isArray(country.capital) ? country.capital[0] : null

      return {
        name:       country.name?.common || null,
        capital,
        population: country.population   ?? 0,
        region:     country.region       || 'Unknown',
        subregion:  country.subregion    || null,
        area:       country.area         || null,
        languages,
        currencies,
        flag_url:   country.flags?.png   || null,
      }
    })
    // Remove países sem nome (dados inválidos)
    .filter((c) => c.name)

  const removed = rawData.length - transformed.length
  console.log(
    `[TRANSFORM] ✅ ${transformed.length} registros válidos (${removed} removidos)`
  )
  return transformed
}

module.exports = { transform }
