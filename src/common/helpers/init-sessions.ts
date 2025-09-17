import * as session from 'express-session';
import * as connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';

export const initializeSessions = (app: any) => {
  const PgStore = connectPgSimple(session);

  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL, // or your manual config
  });

  app.use(
    session({
      store: new PgStore({
        pool: pgPool, // Connection pool
        tableName: 'session', // Must match table created above
        createTableIfMissing: true, // optional auto create
      }),
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 120 * 60 * 1000 },
      rolling: true,
    }),
  );
};
