# GameShelf

Biblioteca pessoal local para catalogar jogos, acompanhar seu status, registrar notas e observações e gerar sinopses com a API da OpenAI.

## Requisitos

- Node.js 24 LTS
- npm 11
- Uma chave da API da OpenAI para gerar sinopses (opcional; o restante do app funciona sem ela)

## Configuração

1. Instale as dependências:

   ```powershell
   npm install
   ```

2. Copie o arquivo de exemplo e configure sua chave localmente:

   ```powershell
   Copy-Item .env.example .env
   ```

   Em `.env`, defina `OPENAI_API_KEY` com sua chave. O arquivo `.env` é ignorado pelo Git. Nunca coloque a chave em arquivos versionados nem no banco.

3. Crie ou atualize o banco local:

   ```powershell
   npm run db:migrate
   ```

## Executar

```powershell
npm run dev
```

Abra <http://localhost:3000>. Os dados ficam no arquivo SQLite `prisma/dev.db`.

## Verificações

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Os testes usam um banco SQLite separado (`prisma/test.db`) e não alteram sua biblioteca local.

## Sinopses com IA

Configure `OPENAI_API_KEY` em `.env`. O provedor e o modelo podem ser configurados por `OPENAI_MODEL` (padrão: `gpt-5-mini`). A chave é lida somente no servidor e não é armazenada no banco. As sinopses geradas são salvas no registro do jogo e podem ser regeneradas.

## Escopo

O MVP é local e de usuário único. Não inclui autenticação, compartilhamento, hospedagem online ou integração com catálogo externo.
