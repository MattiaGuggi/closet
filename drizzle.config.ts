import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/schema.ts', // Il percorso del tuo file schema
  out: './drizzle',                 // Dove Drizzle salverà lo storico delle modifiche
  dialect: 'postgresql',             // Stiamo usando Postgres
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Prende la stringa dal file .env
  },
});
