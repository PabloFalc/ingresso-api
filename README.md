# Ingresse API

## Desenvolvimento

### Requisitos

- Node.js (LTS)
- pnpm
- Docker + Docker Compose

### Passo a passo

1. Instale as dependencias:

```bash
pnpm install
```

2. Copie as informações .env.example e cole no .env

3. Suba os containers:

```bash
pnpm docker:init
```

4. Envie as migrations para o banco:

```bash
pnpm db:migrate
```

- Caso migrate não funcione utilize
``` bash
pnpm db:push
```

- Em ultimo caso, apague as migrations e rode o comando:
```bash
pnpm db:generate
pnpm db:migrate ou pnpm db:push
```

6. Fazer seed do banco de dados:

```bash
pnpm db:seed
```

5. Rode a aplicacao em modo desenvolvimento:

```bash
pnpm start:dev
```

6. Comando de teste:

```bash
pnpm test

pnpm test:2e2
```

Para parar os containers:

```bash
pnpm docker:stop
```
