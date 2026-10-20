/**
 * SiteHub Express Backend API Router
 * Production-ready GitHub OAuth, real repository creation, atomic Git sync,
 * encrypted secrets management, and form endpoints.
 */

import { Request, Response, Router } from 'express';
import { getServerConfig } from './config';
import {
  decryptToken,
  encryptToken,
  generateOAuthState,
  generateSessionId,
  redactSecrets,
} from './security/encryption';
import { db, SessionRecord } from './storage/db';
import { GitHubApiClient, validateRepoName } from './github/githubApi';
import { AiService } from './ai/aiService';
import { AiRouter } from './ai/router';
import { supabaseStore } from './storage/supabaseStore';

export const apiRouter = Router();

/**
 * Session resolver middleware: extracts or provisions a secure session ID.
 */
function resolveSession(req: Request, res: Response): SessionRecord {
  // Check cookie, X-Session-Id header, or Authorization header
  let sessionId =
    req.cookies?.sitehub_session ||
    (req.headers['x-session-id'] as string) ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  let session: SessionRecord | null = null;
  if (sessionId) {
    session = db.getSession(sessionId);
  }

  if (!session) {
    sessionId = generateSessionId();
    session = db.createSession(sessionId, `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  }

  // Set secure cookie for cross-origin preview / production
  res.cookie('sitehub_session', session.id, {
    httpOnly: true,
    secure: true, // Required for SameSite=None
    sameSite: 'none', // Required for cross-origin iframe preview
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  res.setHeader('X-Session-Id', session.id);

  return session;
}

// ==========================================
// System & Health Endpoints
// ==========================================

apiRouter.get('/health', (req, res) => {
  const config = getServerConfig();
  res.json({
    status: 'ok',
    app: config.appName,
    mode: config.appMode,
    githubConfigured: config.isGitHubConfigured,
    callbackUrl: config.githubCallbackUrl,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/config', (req, res) => {
  const config = getServerConfig();
  res.json({
    appName: config.appName,
    appMode: config.appMode,
    appBaseUrl: config.appBaseUrl,
    githubConfigured: config.isGitHubConfigured,
    githubCallbackUrl: config.githubCallbackUrl,
    hasKiraKey: Boolean(process.env.KIRA_API_KEY),
    hasKiraCodeKey: Boolean(process.env.KIRA_CODE_API_KEY),
    hasNemotronKey: Boolean(process.env.NEMOTRON_API_KEY),
  });
});

// ==========================================
// GitHub OAuth & Integration Routes
// ==========================================

/**
 * 1. GET /api/github/status
 * Check current user's GitHub connection status.
 */
apiRouter.get('/github/status', async (req, res) => {
  try {
    const session = resolveSession(req, res);
    const config = getServerConfig();
    const conn = db.getGitHubConnection(session.userId);

    if (!conn) {
      return res.json({
        isConnected: false,
        isConfigured: config.isGitHubConfigured,
        callbackUrl: config.githubCallbackUrl,
        username: null,
        avatarUrl: null,
      });
    }

    // Verify token validity with GitHub API
    try {
      const decrypted = decryptToken(conn.encryptedAccessToken);
      const user = await GitHubApiClient.getAuthenticatedUser(decrypted);

      return res.json({
        isConnected: true,
        isConfigured: config.isGitHubConfigured,
        callbackUrl: config.githubCallbackUrl,
        username: user.login,
        avatarUrl: user.avatar_url,
        name: user.name,
        connectedAt: conn.connectedAt,
      });
    } catch (err: any) {
      // Token expired or revoked on GitHub side
      console.warn(`[GitHub Auth] Token check failed for user ${conn.username}: ${err.message}`);
      db.deleteGitHubConnection(session.userId);
      return res.json({
        isConnected: false,
        isConfigured: config.isGitHubConfigured,
        callbackUrl: config.githubCallbackUrl,
        error: 'GitHub authorization expired or was revoked. Please reconnect.',
      });
    }
  } catch (error: any) {
    console.error('[GitHub Status Error]', redactSecrets(error.message));
    res.status(500).json({ error: 'Failed to verify GitHub connection status.' });
  }
});

/**
 * 2. GET /api/github/auth-url
 * Generates OAuth state parameter and returns GitHub authorization URL.
 */
apiRouter.get('/github/auth-url', (req, res) => {
  try {
    const config = getServerConfig();
    if (!config.isGitHubConfigured) {
      return res.status(503).json({
        error: 'GITHUB_NOT_CONFIGURED',
        message:
          'GitHub OAuth credentials are not set on the server. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in the Render environment variables dashboard.',
        callbackUrl: config.githubCallbackUrl,
      });
    }

    const session = resolveSession(req, res);
    const state = generateOAuthState();

    // Store state with 10-minute expiry
    db.setOAuthState(session.id, state, 10 * 60 * 1000);

    // Determine redirect URI: allow client query override if on same origin, or use configured
    const clientRedirectUri = (req.query.redirect_uri as string) || config.githubCallbackUrl;

    const params = new URLSearchParams({
      client_id: config.githubClientId,
      redirect_uri: clientRedirectUri,
      scope: 'repo', // Minimum necessary scope for repo creation and commits
      state,
      allow_signup: 'true',
    });

    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;

    res.json({
      url,
      state,
      callbackUrl: clientRedirectUri,
    });
  } catch (error: any) {
    console.error('[GitHub Auth URL Error]', redactSecrets(error.message));
    res.status(500).json({ error: 'Failed to generate GitHub authorization URL.' });
  }
});

/**
 * 3. GET /api/authgithub/callback & GET /api/github/callback
 * Handles OAuth callback from GitHub, exchanges code, encrypts token, stores user.
 */
const handleOAuthCallback = async (req: Request, res: Response) => {
  const { code, state, error, error_description } = req.query;

  // Handle user denied or GitHub error
  if (error) {
    const errorMsg = (error_description as string) || (error as string) || 'GitHub authorization was denied.';
    return res.status(400).send(`
      <!doctype html>
      <html>
        <head>
          <title>GitHub Authorization Failed</title>
          <style>body { font-family: sans-serif; background: #0a0a0c; color: #f4f4f5; text-align: center; padding: 50px; }</style>
        </head>
        <body>
          <h2 style="color: #ef4444;">Authorization Denied</h2>
          <p>${escapeHtml(errorMsg)}</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'SITEHUB_GITHUB_OAUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
              setTimeout(() => window.close(), 1500);
            }
          </script>
        </body>
      </html>
    `);
  }

  if (!code || !state) {
    return res.status(400).send(`
      <!doctype html>
      <html>
        <head><title>Invalid OAuth Callback</title></head>
        <body style="font-family: sans-serif; background: #0a0a0c; color: #f4f4f5; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">Invalid Callback Request</h2>
          <p>Missing authorization code or state parameter.</p>
        </body>
      </html>
    `);
  }

  // Verify and consume state (CSRF Protection)
  const stateVerification = db.verifyAndConsumeOAuthState(state as string);
  if (!stateVerification.valid || !stateVerification.session) {
    return res.status(403).send(`
      <!doctype html>
      <html>
        <head><title>CSRF / State Verification Failed</title></head>
        <body style="font-family: sans-serif; background: #0a0a0c; color: #f4f4f5; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">OAuth State Verification Failed</h2>
          <p>The authorization state was expired or mismatched. Please return to SiteHub and click "Connect GitHub" again.</p>
        </body>
      </html>
    `);
  }

  const session = stateVerification.session;

  try {
    const config = getServerConfig();
    const effectiveRedirectUri = `${config.appBaseUrl}${req.baseUrl}${req.path}`;

    // Server-to-server token exchange
    const { accessToken, scope } = await GitHubApiClient.exchangeCodeForToken(code as string, effectiveRedirectUri);

    // Fetch GitHub user profile
    const githubUser = await GitHubApiClient.getAuthenticatedUser(accessToken);

    // Encrypt access token at rest using AES-256-GCM
    const encryptedToken = encryptToken(accessToken);

    // Store in persistent database
    db.saveGitHubConnection({
      userId: session.userId,
      githubUserId: githubUser.id,
      username: githubUser.login,
      avatarUrl: githubUser.avatar_url,
      encryptedAccessToken: encryptedToken,
      scopes: scope ? scope.split(',').map(s => s.trim()) : ['repo'],
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Re-set session cookie
    res.cookie('sitehub_session', session.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Send popup message and close window (or redirect if in same tab)
    return res.send(`
      <!doctype html>
      <html>
        <head>
          <title>GitHub Connected — SiteHub</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090b; color: #f4f4f5; text-align: center; padding: 60px 20px; }
            .card { max-width: 420px; margin: 0 auto; background: #18181b; padding: 32px; border-radius: 16px; border: 1px solid #27272a; }
            .badge { display: inline-block; padding: 6px 12px; background: rgba(16, 185, 129, 0.15); color: #34d399; border-radius: 9999px; font-weight: 600; font-size: 13px; margin-bottom: 16px; }
            h2 { margin: 0 0 10px; font-size: 22px; }
            p { color: #a1a1aa; font-size: 14px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">✓ Connected Successfully</div>
            <h2>Welcome, ${escapeHtml(githubUser.login)}!</h2>
            <p>Your GitHub account is securely linked with SiteHub. This window will close automatically...</p>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'SITEHUB_GITHUB_OAUTH_SUCCESS',
                  username: ${JSON.stringify(githubUser.login)},
                  avatarUrl: ${JSON.stringify(githubUser.avatar_url)},
                  sessionId: ${JSON.stringify(session.id)}
                }, '*');
                setTimeout(() => window.close(), 600);
              } else {
                window.location.href = '/?github_connected=1';
              }
            } catch (e) {
              window.location.href = '/?github_connected=1';
            }
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('[GitHub Callback Error]', redactSecrets(error.message));
    return res.status(500).send(`
      <!doctype html>
      <html>
        <head><title>Connection Error</title></head>
        <body style="font-family: sans-serif; background: #0a0a0c; color: #f4f4f5; text-align: center; padding: 50px;">
          <h2 style="color: #ef4444;">GitHub Connection Failed</h2>
          <p>${escapeHtml(error.message || 'Server error exchanging authorization code.')}</p>
        </body>
      </html>
    `);
  }
};

apiRouter.get('/authgithub/callback', handleOAuthCallback);
apiRouter.get('/github/callback', handleOAuthCallback);

/**
 * 4. POST /api/github/disconnect
 * Revokes local association and clears connection record.
 */
apiRouter.post('/github/disconnect', (req, res) => {
  try {
    const session = resolveSession(req, res);
    db.deleteGitHubConnection(session.userId);
    res.json({ success: true, message: 'GitHub account disconnected successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to disconnect GitHub account.' });
  }
});

/**
 * 5. GET /api/github/repos
 * Lists repositories for the authenticated user.
 */
apiRouter.get('/github/repos', async (req, res) => {
  try {
    const session = resolveSession(req, res);
    const conn = db.getGitHubConnection(session.userId);
    if (!conn) {
      return res.status(401).json({ error: 'GitHub account is not connected.' });
    }

    const token = decryptToken(conn.encryptedAccessToken);
    const repos = await GitHubApiClient.listUserRepositories(token);
    res.json({ repos });
  } catch (error: any) {
    console.error('[GitHub List Repos Error]', redactSecrets(error.message));
    res.status(500).json({ error: error.message || 'Failed to list GitHub repositories.' });
  }
});

/**
 * 6. POST /api/github/repos/create
 * Creates a real repository in the user's GitHub account.
 */
apiRouter.post('/github/repos/create', async (req, res) => {
  try {
    const session = resolveSession(req, res);
    const conn = db.getGitHubConnection(session.userId);
    if (!conn) {
      return res.status(401).json({ error: 'GitHub account is not connected.' });
    }

    const { name, description, isPrivate, siteId } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Repository name is required.' });
    }

    const token = decryptToken(conn.encryptedAccessToken);
    const result = await GitHubApiClient.createRepository(token, {
      name,
      description,
      isPrivate: Boolean(isPrivate),
    });

    if (siteId) {
      db.saveRepoAssociation({
        id: `repo-${Date.now()}`,
        userId: session.userId,
        siteId,
        repoOwner: result.owner,
        repoName: result.name,
        repoFullName: result.fullName,
        defaultBranch: result.defaultBranch,
        htmlUrl: result.htmlUrl,
        isPrivate: result.isPrivate,
        createdAt: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      repository: result,
    });
  } catch (error: any) {
    console.error('[GitHub Create Repo Error]', redactSecrets(error.message));
    res.status(400).json({ error: error.message || 'Failed to create GitHub repository.' });
  }
});

/**
 * 7. POST /api/github/sync
 * Commits the actual generated website project files to the GitHub repository.
 */
apiRouter.post('/github/sync', async (req, res) => {
  try {
    const session = resolveSession(req, res);
    const conn = db.getGitHubConnection(session.userId);
    if (!conn) {
      return res.status(401).json({ error: 'GitHub account is not connected.' });
    }

    const { repoOwner, repoName, branch, files, commitMessage, siteId } = req.body;

    if (!repoOwner || !repoName) {
      return res.status(400).json({ error: 'Missing repoOwner or repoName parameter.' });
    }

    if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided for commit synchronization.' });
    }

    const token = decryptToken(conn.encryptedAccessToken);

    const syncResult = await GitHubApiClient.syncProjectFiles(
      token,
      repoOwner,
      repoName,
      files,
      commitMessage || 'chore: update website via SiteHub',
      branch
    );

    // Save history
    db.addSyncHistory({
      id: `sync-${Date.now()}`,
      repoFullName: `${repoOwner}/${repoName}`,
      commitSha: syncResult.commitSha,
      commitMessage: commitMessage || 'chore: update website via SiteHub',
      commitUrl: syncResult.commitUrl,
      branch: syncResult.branch,
      filesCount: syncResult.filesCount,
      timestamp: syncResult.timestamp,
      status: 'success',
    });

    res.json({
      success: true,
      ...syncResult,
    });
  } catch (error: any) {
    console.error('[GitHub Sync Error]', redactSecrets(error.message));
    res.status(500).json({ error: error.message || 'Failed to synchronize files with GitHub.' });
  }
});

/**
 * 8. GET /api/github/sync-history
 * Returns sync commit history for a repository.
 */
apiRouter.get('/github/sync-history', (req, res) => {
  const repoFullName = req.query.repoFullName as string;
  const history = db.getSyncHistory(repoFullName);
  res.json({ history });
});

// ==========================================
// AI Generation & Execution Endpoints
// ==========================================

apiRouter.post('/ai/generate', async (req, res) => {
  try {
    const { prompt, currentSite, selectedModel, systemInstructions, clientKeys } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt parameter.' });
    }

    const result = await AiRouter.generateSite(
      prompt,
      currentSite,
      selectedModel,
      systemInstructions,
      clientKeys
    );

    res.json(result);
  } catch (error: any) {
    console.error('[AI Generation Error]', error);
    res.status(500).json({ error: error.message || 'AI generation failed.' });
  }
});

apiRouter.post('/ai/test-key', async (req, res) => {
  try {
    const { provider, key } = req.body;
    if (!provider || !key) {
      return res.status(400).json({ error: 'Provider and key are required.' });
    }

    const result = await AiRouter.testKey(provider, key);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apiRouter.get('/ai/status', (req, res) => {
  res.json({
    gemini: Boolean(process.env.GEMINI_API_KEY),
    nemotron: Boolean(process.env.NEMOTRON_API_KEY),
    kiraCode: Boolean(process.env.KIRA_CODE_API_KEY),
    kiraGeneral: Boolean(process.env.KIRA_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY),
    deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/ai/models', (req, res) => {
  res.json({ models: AiService.getModelCatalogue() });
});

apiRouter.post('/ai/chat', async (req, res) => {
  try {
    const { messages, prompt, model, systemInstruction, temperature, maxOutputTokens, topP, topK, thinkingLevel, tools, clientKeys } = req.body;
    
    // Support single prompt or multi-turn messages array
    const messageList = Array.isArray(messages) && messages.length > 0
      ? messages
      : [{ role: 'user', content: prompt || 'Hello' }];

    const result = await AiService.chat({
      messages: messageList,
      model,
      systemInstruction,
      temperature,
      maxOutputTokens,
      topP,
      topK,
      thinkingLevel,
      tools,
      clientKeys,
    });

    res.json(result);
  } catch (error: any) {
    console.error('[AI Chat Error]', error);
    res.status(500).json({ success: false, error: error.message || 'Chat request failed.' });
  }
});

apiRouter.post('/ai/stream', async (req, res) => {
  try {
    const { messages, prompt, model, systemInstruction, temperature, maxOutputTokens, topP, topK, thinkingLevel, tools, clientKeys } = req.body;

    const messageList = Array.isArray(messages) && messages.length > 0
      ? messages
      : [{ role: 'user', content: prompt || 'Stream demo' }];

    // Prepare Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const summary = await AiService.streamChat(
      {
        messages: messageList,
        model,
        systemInstruction,
        temperature,
        maxOutputTokens,
        topP,
        topK,
        thinkingLevel,
        tools,
        clientKeys,
      },
      chunk => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    );

    res.write(`data: ${JSON.stringify({ done: true, summary })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('[AI Stream Error]', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Stream failed.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

apiRouter.post('/ai/generate-media', async (req, res) => {
  try {
    const { prompt, style, aspectRatio, clientKeys } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required for media generation.' });
    }

    const result = await AiService.generateMedia({
      prompt,
      style,
      aspectRatio,
      clientKeys,
    });

    res.json(result);
  } catch (error: any) {
    console.error('[AI Media Error]', error);
    res.status(500).json({ success: false, error: error.message || 'Media generation failed.' });
  }
});

apiRouter.get('/secrets', (req, res) => {
  const getLast4 = (val?: string) => {
    if (!val || val.trim().length < 4) return 'none';
    return val.trim().slice(-4);
  };

  const secretsList = [
    {
      name: 'KIRA_CODE_API_KEY',
      category: 'AI key',
      scope: 'App',
      last4: getLast4(process.env.KIRA_CODE_API_KEY),
      status: process.env.KIRA_CODE_API_KEY ? 'Connected' : 'Not connected',
      note: 'kiraai.vn coding key for DeepSeek V4.1 Flash and GLM 5.1',
    },
    {
      name: 'KIRA_API_KEY',
      category: 'AI key',
      scope: 'App',
      last4: getLast4(process.env.KIRA_API_KEY),
      status: process.env.KIRA_API_KEY ? 'Connected' : 'Not connected',
      note: 'kiraai.vn general key for planning, copy, and vision models',
    },
    {
      name: 'NEMOTRON_API_KEY',
      category: 'AI key',
      scope: 'App',
      last4: getLast4(process.env.NEMOTRON_API_KEY),
      status: process.env.NEMOTRON_API_KEY ? 'Connected' : 'Not connected',
      note: 'NVIDIA Nemotron 3 Ultra for second-opinion review & architecture',
    },
    {
      name: 'GEMINI_API_KEY',
      category: 'AI key',
      scope: 'App',
      last4: getLast4(process.env.GEMINI_API_KEY),
      status: process.env.GEMINI_API_KEY ? 'Connected' : 'Not connected',
      note: 'Google Gemini 2.5/3.8 Flash model key',
    },
    {
      name: 'GITHUB_CLIENT_ID',
      category: 'GitHub',
      scope: 'App',
      last4: getLast4(process.env.GITHUB_CLIENT_ID),
      status: process.env.GITHUB_CLIENT_ID ? 'Connected' : 'Not connected',
      note: 'GitHub OAuth App client identifier',
    },
    {
      name: 'SUPABASE_ANON_KEY',
      category: 'Database',
      scope: 'App',
      last4: getLast4(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY),
      status: (process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY) ? 'Connected' : 'Not connected',
      note: 'Supabase persistence key (project omtpzesyovduuubkosxz)',
    },
  ];

  res.json({ secrets: secretsList });
});

apiRouter.post('/forms', async (req, res) => {
  try {
    const { siteId, name, email, message, ...data } = req.body;
    const record = {
      id: `sub-${Date.now()}`,
      siteId,
      name,
      email,
      message,
      data,
      createdAt: new Date().toISOString(),
    };
    await supabaseStore.saveSubmission(record);
    res.json({
      success: true,
      submissionId: record.id,
      receivedAt: record.createdAt,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/bookings', async (req, res) => {
  try {
    const { siteId, date, time, guests, name, email } = req.body;
    const record = {
      id: `bk-${Date.now()}`,
      siteId,
      date: date || new Date().toISOString().slice(0, 10),
      time: time || '19:00',
      guests: guests ? String(guests) : '2',
      name: name || 'Guest',
      email: email || 'guest@example.com',
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };
    await supabaseStore.saveBooking(record);
    res.json({
      success: true,
      bookingId: record.id,
      status: 'confirmed',
      booking: record,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/orders', async (req, res) => {
  try {
    const { siteId, items, total, customerName, customerEmail } = req.body;
    const record = {
      id: `ord-${Date.now()}`,
      siteId,
      items: Array.isArray(items) ? items : [],
      total: typeof total === 'number' ? total : 0,
      customerName,
      customerEmail,
      status: 'paid' as const,
      createdAt: new Date().toISOString(),
    };
    await supabaseStore.saveOrder(record);
    res.json({
      success: true,
      orderId: record.id,
      status: 'paid',
      order: record,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/publish', async (req, res) => {
  try {
    const { siteSlug, siteDocument, htmlContent } = req.body;
    const config = getServerConfig();
    const slug = (siteSlug || siteDocument?.slug || 'my-site')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const deploymentUrl = `${config.appBaseUrl}/s/${slug}`;

    const record = {
      id: `dep-${Date.now()}`,
      siteId: siteDocument?.id || `site-${slug}`,
      slug,
      url: deploymentUrl,
      htmlContent: htmlContent || generateFullHtml(siteDocument),
      siteDocument: siteDocument || null,
      publishedAt: new Date().toISOString(),
    };

    await supabaseStore.saveDeployment(record);

    res.json({
      success: true,
      url: deploymentUrl,
      slug,
      publishedAt: record.publishedAt,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/s/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const deployment = await supabaseStore.getDeployment(slug);
    if (!deployment) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Site Not Found — SiteHub</title></head>
          <body style="font-family: sans-serif; background: #0B0D12; color: #F3F5FA; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="text-align: center;">
              <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">404 — Site Not Found</h1>
              <p style="color: #A1A8B8;">The site <code>${escapeHtml(slug)}</code> has not been published yet.</p>
              <a href="/" style="color: #818cf8; text-decoration: none;">Return to SiteHub Studio</a>
            </div>
          </body>
        </html>
      `);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' 'unsafe-inline' https: data:; sandbox allow-scripts allow-forms allow-same-origin;"
    );
    res.send(deployment.htmlContent);
  } catch (err: any) {
    res.status(500).send(`Server error: ${escapeHtml(err.message)}`);
  }
});

export function generateFullHtml(site?: any): string {
  if (!site) return '<html><body><h1>No site content</h1></body></html>';
  const name = escapeHtml(site.name || 'SiteHub Project');
  const title = escapeHtml(site.title || name);
  const desc = escapeHtml(site.description || '');
  const primaryColor = site.theme?.primaryColor || '#6366f1';
  const bgColor = site.theme?.backgroundColor || '#09090b';
  const textColor = site.theme?.textColor || '#fafaf9';

  const sectionsHtml = (site.pages?.[0]?.sections || [])
    .map((s: any) => {
      if (s.isHidden) return '';
      if (s.type === 'navbar') {
        return `
          <header class="py-4 px-6 border-b border-neutral-800 flex justify-between items-center max-w-7xl mx-auto">
            <span class="font-bold text-lg">${escapeHtml(s.props?.brandName || name)}</span>
            <nav class="flex gap-4 text-sm text-neutral-400">
              ${(s.props?.links || []).map((l: any) => `<a href="${escapeHtml(l.href || '#')}" class="hover:text-white">${escapeHtml(l.label)}</a>`).join('')}
            </nav>
          </header>
        `;
      }
      if (s.type === 'hero') {
        return `
          <section class="py-20 px-6 text-center max-w-4xl mx-auto space-y-6">
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight">${escapeHtml(s.title)}</h1>
            <p class="text-lg text-neutral-400 max-w-2xl mx-auto">${escapeHtml(s.subtitle || '')}</p>
            <div class="flex justify-center gap-4 pt-4">
              <a href="#contact" class="px-6 py-3 rounded-xl font-bold text-white shadow-lg" style="background-color: ${primaryColor}">Get Started</a>
            </div>
          </section>
        `;
      }
      if (s.type === 'pricing') {
        const plans = s.props?.plans || s.props?.tiers || [];
        return `
          <section id="pricing" class="py-20 px-6 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(s.title)}</h2>
            <div class="grid md:grid-cols-3 gap-8">
              ${plans.map((p: any) => `
                <div class="p-8 rounded-3xl bg-neutral-900 border ${p.isPopular ? 'border-indigo-500' : 'border-neutral-800'} space-y-4">
                  <h3 class="text-xl font-bold">${escapeHtml(p.name)}</h3>
                  <div class="text-3xl font-extrabold">${escapeHtml(p.price)} <span class="text-xs text-neutral-400 font-normal">${escapeHtml(p.period || '/mo')}</span></div>
                  <ul class="space-y-2 text-sm text-neutral-300">
                    ${(p.features || []).map((f: string) => `<li>✓ ${escapeHtml(f)}</li>`).join('')}
                  </ul>
                  <button class="w-full py-3 rounded-xl font-bold text-sm bg-neutral-800 hover:bg-neutral-700 text-white">Choose ${escapeHtml(p.name)}</button>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }
      if (s.type === 'testimonials') {
        const items = s.props?.items || s.props?.testimonials || [];
        return `
          <section class="py-20 px-6 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center mb-12">${escapeHtml(s.title)}</h2>
            <div class="grid md:grid-cols-2 gap-8">
              ${items.map((t: any) => `
                <div class="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div class="text-amber-400">★★★★★</div>
                  <p class="italic text-neutral-300">"${escapeHtml(t.quote)}"</p>
                  <div class="font-bold text-white text-sm">${escapeHtml(t.author)}</div>
                  <div class="text-xs text-neutral-400">${escapeHtml(t.title || '')}</div>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }
      if (s.type === 'faq') {
        const items = s.props?.items || s.props?.faqs || [];
        return `
          <section class="py-20 px-6 max-w-3xl mx-auto space-y-4">
            <h2 class="text-3xl font-bold text-center mb-10">${escapeHtml(s.title)}</h2>
            ${items.map((q: any) => `
              <div class="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <h4 class="font-semibold text-white">${escapeHtml(q.question || q.q)}</h4>
                <p class="text-sm text-neutral-400">${escapeHtml(q.answer || q.a)}</p>
              </div>
            `).join('')}
          </section>
        `;
      }
      return `
        <section class="py-16 px-6 max-w-6xl mx-auto">
          <h2 class="text-2xl font-bold mb-4">${escapeHtml(s.title)}</h2>
          ${s.subtitle ? `<p class="text-neutral-400 text-sm mb-6">${escapeHtml(s.subtitle)}</p>` : ''}
        </section>
      `;
    })
    .join('');

  return `<!doctype html>
<html lang="${site.language || 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', sans-serif; background-color: ${bgColor}; color: ${textColor}; }
  </style>
</head>
<body class="antialiased min-h-screen">
  ${sectionsHtml}
  <footer class="py-8 px-6 text-center text-xs text-neutral-500 border-t border-neutral-800 mt-20">
    © ${new Date().getFullYear()} ${name}. Powered by SiteHub.
  </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
