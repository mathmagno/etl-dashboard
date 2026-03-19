const axios = require('axios')

/**
 * EXTRACT — Etapa 1 do ETL
 * Busca os dados brutos da API pública restcountries.com
 * Retorna um array com todos os países no formato original da API
 */
async function extract() {
  console.log('[EXTRACT] Conectando à API restcountries.com...')

  const fields = 'name,capital,population,region,subregion,area,languages,currencies,flags'
  const response = await axios.get(`https://restcountries.com/v3.1/all?fields=${fields}`, {
    timeout: 15000,
  })

  console.log(`[EXTRACT] ✅ ${response.data.length} registros extraídos da API`)
  return response.data
}

module.exports = { extract }
