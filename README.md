# Bora — Front end (Trabalho 3)

**Bora** é a interface web para consumir a API REST do **Trabalho 3 de
Persistência** (FastAPI + Beanie + MongoDB), localizada em
`../persistencia--trabalho_03`.

Feito em **React 18 + Vite + Material UI**, com visual inspirado nos apps de
mobilidade (Uber / 99): tema claro de alto contraste, tipografia forte, cartões
arredondados, sidebar no desktop e barra de navegação inferior no mobile.

> A versão anterior (JavaScript puro + Bootstrap, sem build) foi preservada em
> [`legacy/`](./legacy/) e continua funcionando ao ser servida como pasta estática.

## Funcionalidades

| Tela | O que faz |
| --- | --- |
| **Painel** | Contagem de motoristas, passageiros, veículos, localizações e viagens + viagens por ponto de partida. |
| **Motoristas / Passageiros** | CRUD completo, busca por campo (nome, e-mail, CPF), ordenação e paginação. |
| **Veículos** | CRUD completo com vínculo ao motorista; busca por placa, modelo, cor e ano. |
| **Localizações** | CRUD completo (cidade, rua, número, latitude, longitude). |
| **Viagens** | Criação relacionando motorista + passageiro + origem + destino; alteração de status; busca e paginação. |
| **Consultas** | As 4 consultas complexas (3+ entidades) expostas pelo back end. |

## Como executar

### 1. Suba o back end

```sh
cd ../persistencia--trabalho_03
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000
```

> O back end já vem com CORS liberado (`allow_origins=["*"]`).

### 2. Suba o front end

Requer **Node 18+**.

```sh
npm install
npm run dev            # http://localhost:5500
```

Para gerar a versão de produção:

```sh
npm run build          # gera dist/
npm run preview        # serve dist/ localmente
```

## Estrutura

```
src/
  main.jsx                 # providers (tema, config da API, snackbar) + router
  App.jsx                  # definição das rotas
  theme/theme.js           # design system Material UI (estilo Uber/99)
  lib/
    apiConfig.js           # resolução da URL base da API
    apiClient.js           # cliente HTTP (request, ApiError, errorMessage)
    crudResource.js        # fábrica de CRUD genérico
  api/index.js             # objeto `api` (recursos + consultas complexas)
  config/
    navigation.js          # itens de navegação (rota, rótulo, ícone)
    status.js              # rótulos/cores dos status de viagem
  context/
    ApiConfigContext.jsx   # URL base + estado de saúde da API
    NotifyContext.jsx      # snackbars de sucesso/erro
  hooks/
    useApiHealth.js        # ping periódico em `/`
    useCrudResource.js     # estado de listagem (busca, ordenação, paginação)
  components/
    layout/                # AppLayout, SideNav, BottomNav, MobileTopBar, ...
    common/                # PageHeader, DataTable, StatCard, EmptyState, ...
    crud/                  # CrudPage + CrudForm/Toolbar/Table/CreateCard/EditDialog
  features/
    dashboard/             # DashboardPage
    motoristas/ passageiros/ veiculos/ localizacoes/ viagens/   # config.jsx de cada CRUD
    consultas/             # ConsultasPage + QueryBlock + queries.js
    settings/              # SettingsDialog
```

Cada recurso "plano" só precisa de um `config.jsx` declarativo (colunas, campos de
formulário, mapeamento para os parâmetros da API); a tela em si é a `<CrudPage>`
genérica.

## Detalhes de integração com a API

- **POST** (criar) e **PUT** (atualizar) recebem os dados como *query parameters* —
  o cliente (`src/lib/apiClient.js`) monta a query automaticamente.
- `POST /{recurso}/filter` recebe o filtro no corpo JSON
  (`{ campo: { "$regex": "valor" } }`) e `page` / `page_size` / `sort_by` na query.
- A ordenação inicia desligada (o back end valida o nome da coluna); selecione um
  campo em "Ordenar por" para ativá-la.
- A paginação avança enquanto a página vem cheia (o back end não retorna o total
  global de registros).
