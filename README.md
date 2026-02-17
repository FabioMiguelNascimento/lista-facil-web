# Lista Fácil — Web 

Interface web da aplicação **Lista Fácil**. Consumidora da API (`lista-facil-backend`) para criar/editar listas e itens em tempo real.

## Tecnologias

- TypeScript, React
- Framework: Next.js (app router)
- Estilização: Tailwind CSS
- Estado: Zustand
- Websockets: socket.io-client

---

## Rodando localmente

1. Clone o repositório:

```bash
git clone https://github.com/FabioMiguelNascimento/lista-facil-frontend.git
cd lista-facil-web
```

2. Instale dependências:

```bash
pnpm install
```

3. Variáveis de ambiente

Crie um arquivo `.env` (há um `.env` de exemplo no repositório). Exemplo mínimo:

```env
NEXT_PUBLIC_API_URL="http://localhost:8080"
NEXT_PUBLIC_SOCKET_URL="http://localhost:8080"
```

> Observação: o backend deste projeto usa por padrão a porta `8080` — ajuste `NEXT_PUBLIC_API_URL` caso o backend rode em outra porta.

4. Inicie o servidor de desenvolvimento:

```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000` por padrão.

---

## Scripts úteis

- `pnpm run dev` — servidor de desenvolvimento
- `pnpm run build` — build de produção
- `pnpm run start` — iniciar build em produção

---

## Onde configurar a URL da API

O cliente Axios usa `process.env.NEXT_PUBLIC_API_URL` (veja `src/lib/api.ts`).

---

## Deploy

Você pode fazer deploy em Vercel, Netlify ou qualquer serviço que suporte Next.js. Para produção, rode `pnpm build` e exponha `NEXT_PUBLIC_API_URL` apontando para a API em produção.

---

Qualquer alteração de rota/API — avise que eu atualizo o README com exemplos de requests e endpoints. 
