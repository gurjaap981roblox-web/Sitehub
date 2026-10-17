/**
 * SiteHub Full-Stack Server
 * Mounts Express API routes (/api/*) and attaches Vite dev middlewares.
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/apiRouter';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Attach API routes
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Attach Vite middlewares in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SiteHub server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
