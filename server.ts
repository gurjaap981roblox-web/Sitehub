/**
 * SiteHub Full-Stack Server
 * Mounts Express API routes (/api/*) and attaches Vite dev middlewares.
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import { apiRouter } from './server/apiRouter';
import { getServerConfig, validateEnvironmentAtStartup } from './server/config';

import path from 'path';

async function startServer() {
  const app = express();
  const config = getServerConfig();
  const PORT = config.port;

  // Validate environment variables at startup
  const validation = validateEnvironmentAtStartup();
  if (!validation.valid) {
    console.warn(`[SiteHub Auth Notice] Missing GitHub credentials: ${validation.missing.join(', ')}.`);
    console.warn(`[SiteHub Auth Notice] GitHub OAuth will run in unconfigured mode until credentials are set in Render dashboard.`);
  }
  validation.warnings.forEach(w => console.warn(`[SiteHub Notice] ${w}`));

  app.use(cookieParser(config.sessionSecret));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Canonical GitHub OAuth redirect alias (/api/authgithub/callback -> /api/github/callback)
  app.get('/api/authgithub/callback', (req, res) => {
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    res.redirect(302, `/api/github/callback${query}`);
  });

  // Direct sandboxed published site routing
  app.get('/s/:slug', (req, res, next) => {
    req.url = `/s/${req.params.slug}`;
    apiRouter(req, res, next);
  });

  // Attach API routes
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      app: config.appName,
      mode: config.appMode,
      githubConfigured: config.isGitHubConfigured,
      time: new Date().toISOString(),
    });
  });

  // Attach Vite middlewares in development or static dist in production with SPA fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/s/')) {
        return next();
      }
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SiteHub server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
