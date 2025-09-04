import * as fs from 'fs';
import * as path from 'path';
import * as session from 'express-session';
const FileStore = require('session-file-store')(session);

export const initializeSessions = (app: any) => {
  // delete the sessions folder
  const sessionsPath = path.join(process.cwd(), 'sessions');
  if (fs.existsSync(sessionsPath)) {
    fs.rmSync(sessionsPath, { recursive: true, force: true });
    fs.mkdirSync(sessionsPath);
  }

  try {
    app.use(
      session({
        store: new FileStore({
          path: './sessions', // folder to store session files
          ttl: 60 * 120, // 2 hours, long but user might be writing long experience challenge and solution
          retries: 0, // avoid endless retries if session file is missing
          reapInterval: 60 * 60, // cleanup every 1h
          reapAsync: true, // do it asynchronously
        }),
        secret: process.env.SESSION_SECRET || 'supersecret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 120 * 60 * 1000, // 2h in ms
        },
        rolling: true, // reset expiration on every request
      }),
    );
  } catch (error) {
    console.log(`Error initializing sessions.`.bgRed.white.bold);
    console.log(error);
    process.exit(1);
  }
};
