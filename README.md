# GameShelf

O GameShelf é uma aplicação web local de usuário único para organizar uma biblioteca pessoal de jogos. Os dados ficam em um banco SQLite local. A aplicação também pode gerar e regenerar sinopses com um provider de IA configurado pelo usuário.

## Stack

- Next.js com App Router
- TypeScript
- SQLite
- Prisma
- Vitest
- Node.js 24 LTS e npm 11

## Funcionalidades

- Cadastrar jogos com título, plataforma, gênero, status, nota e observações.
- Listar jogos e filtrar/pesquisar a biblioteca.
- Consultar os detalhes de um jogo.
- Editar e remover jogos.
- Gerar e regenerar uma sinopse de jogo com IA e salvá-la junto aos dados do jogo.

## Requisitos

- Node.js 24 LTS
- npm 11
- Uma chave válida do provider de IA escolhido para gerar sinopses. O restante da aplicação funciona sem essa configuração.

## Configuração

1. Instale as dependências:

   ```powershell
   npm install
   ```

2. Crie o arquivo de ambiente local a partir do exemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Edite `.env` e escolha o provider:

   ```dotenv
   AI_PROVIDER="openai"
   OPENAI_API_KEY=""
   OPENAI_MODEL="gpt-5-mini"
   GEMINI_API_KEY=""
   GEMINI_MODEL="gemini-3.8-flash"
   OPENROUTER_API_KEY=""
   OPENROUTER_MODEL=""
   ```

   O padrão é `AI_PROVIDER="openai"`. Para usar Gemini, defina `AI_PROVIDER="gemini"` e configure `GEMINI_API_KEY`. Para usar OpenRouter, defina `AI_PROVIDER="openrouter"` e configure `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` com um modelo compatível escolhido no catálogo do OpenRouter. Para OpenAI, configure `OPENAI_API_KEY`. `GEMINI_MODEL` permite escolher o modelo Gemini; o padrão é `gemini-3.8-flash`. `OPENAI_MODEL` também pode ser definido; o padrão é `gpt-5-mini`.

   Configure somente a chave do provider selecionado. `.env` é ignorado pelo Git. Nunca coloque chaves em arquivos versionados ou no banco de dados; elas são lidas no servidor.

4. Crie ou atualize o banco local:

   ```powershell
   npm run db:migrate
   ```

## Executar a aplicação

```powershell
npm run dev
```

Abra <http://localhost:3000>. O banco local é armazenado em `prisma/dev.db`.

## Testes e verificações

Execute os testes automatizados com:

```powershell
npm test
```

Os testes usam um banco SQLite separado (`prisma/test.db`). Os testes dos adapters de IA são simulados: não fazem chamadas reais à OpenAI, Gemini ou OpenRouter. O uso real dos providers depende de credenciais válidas, configuração correta e disponibilidade das respectivas APIs; portanto, não é validado pela suíte automatizada.

Outras verificações disponíveis:

```powershell
npm run lint
npm run typecheck
npm run build
```

## Escopo

O MVP é local e de usuário único. Não inclui autenticação, múltiplos usuários, publicação online ou integração com catálogos externos.
