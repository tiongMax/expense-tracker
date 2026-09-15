# Pennywise

A private, single-user expense tracker built with Next.js, PostgreSQL, Drizzle ORM, and Recharts. Everything runs locally; no cloud database or account is required.

Expenses and budgets support MYR, USD, SGD, EUR, GBP, AUD, and JPY. Currency totals stay separate and are never combined using hidden exchange rates.

## Requirements

- Node.js 20 or newer
- Docker Desktop

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Start PostgreSQL:

   ```bash
   npm run db:start
   ```

   The database listens on `localhost:5433` so it does not conflict with a default PostgreSQL installation on port 5432. The first container startup creates the required tables from `init.sql`.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Database commands

| Command | Purpose |
| --- | --- |
| `npm run db:start` | Start the PostgreSQL container |
| `npm run db:stop` | Stop the container without deleting data |
| `npm run db:logs` | Follow PostgreSQL logs |
| `npm run db:push` | Synchronize the Drizzle schema to the database |
| `npm run db:generate` | Generate SQL migrations after schema changes |

Database data is stored in the Docker volume `pgdata` and survives normal container restarts and `db:stop`.

## API

The Next.js application contains its own backend Route Handlers:

- `GET/POST /api/expenses`
- `PUT/DELETE /api/expenses/:id`
- `GET/POST /api/budgets`
- `PUT/DELETE /api/budgets/:id`

The PostgreSQL connection string is server-only and is never exposed to the browser.

## Production build

```bash
npm run build
npm start
```
