# 🌍 ETL Dashboard — Países do Mundo

Projeto educacional demonstrando um pipeline **ETL** completo com consumo de API REST e banco de dados PostgreSQL.

---

## O que é ETL?

| Etapa | O que faz |
|-------|-----------|
| **E**xtract | Busca dados de uma fonte externa (aqui: API REST pública) |
| **T**ransform | Limpa, filtra e formata os dados brutos |
| **L**oad | Salva os dados processados no banco de dados |

---

## Tecnologias

- **Backend**: Node.js + Express
- **Banco de dados**: PostgreSQL (via Docker)
- **API fonte**: [restcountries.com](https://restcountries.com) (gratuita, sem chave)
- **Frontend**: React + Vite

---

## Como rodar

### Pré-requisitos
- [Node.js](https://nodejs.org) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 1. Subir o banco de dados (PostgreSQL)

```bash
docker-compose up -d
```

Isso cria um container PostgreSQL na porta `5432`.

### 2. Instalar e rodar o backend

```bash
cd backend
npm install
npm run dev
```

Backend disponível em: http://localhost:3001

### 3. Instalar e rodar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em: http://localhost:5173

### 4. Usar o app

1. Abra http://localhost:5173 no navegador
2. Clique em **"▶ Executar ETL"**
3. Aguarde — o sistema vai:
   - Buscar ~250 países da API
   - Transformar os dados
   - Salvar no PostgreSQL
4. A tabela será preenchida automaticamente!

---

## Estrutura do projeto

```
sima_project/
├── docker-compose.yml     # PostgreSQL via Docker
├── .env                   # Variáveis de ambiente
│
├── backend/
│   ├── server.js          # API Express (rotas)
│   └── etl/
│       ├── extract.js     # Etapa 1: busca da API REST
│       ├── transform.js   # Etapa 2: limpeza dos dados
│       ├── load.js        # Etapa 3: salva no PostgreSQL
│       └── pipeline.js    # Orquestra as 3 etapas
│
└── frontend/
    └── src/
        ├── App.jsx
        └── components/
            ├── Header.jsx         # Cabeçalho
            ├── ETLPanel.jsx       # Painel com as 3 etapas
            ├── StatsCards.jsx     # Cards de estatísticas
            └── CountriesTable.jsx # Tabela com busca e filtro
```

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/etl/run` | Executa o pipeline ETL completo |
| GET | `/api/countries` | Lista países (suporta `?search=` e `?region=`) |
| GET | `/api/stats` | Estatísticas gerais |
| GET | `/api/etl/logs` | Histórico de execuções |
