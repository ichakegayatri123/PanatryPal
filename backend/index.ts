import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the project root. Explicit paths keep this
// working even when the server is started from a different working directory.
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import authRouter, { seedDefaultUser } from './auth';
import pantryRouter from './pantry';
import statsRouter from './stats';
import recipesRouter from './recipes';
import { errorHandler } from './http';

const app = express();
const PORT = Number(process.env.PORT || 3001);

// CORS headers configuration
const configuredOrigins = (process.env.APP_URL || 'http://localhost:3000').split(',').map(origin => origin.trim());
app.use((req, res, next) => {
  const origin = req.header('Origin');
  if (origin && configuredOrigins.includes(origin)) res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


// Middleware for parsing JSON requests
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// Log requests middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/pantry', pantryRouter);
app.use('/api/stats', statsRouter);
app.use('/api/recipes', recipesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Seed default users and collections
    await seedDefaultUser();
    
    if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error('PORT must be a valid TCP port');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing backend process, or choose another PORT in .env.`);
      } else {
        console.error('Unable to start server:', error);
      }
      process.exitCode = 1;
    });
  } catch (err) {
    console.error('Failed to start database & server:', err);
    process.exit(1);
  }
}

startServer();
