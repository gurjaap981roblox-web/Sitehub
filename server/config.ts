/**
 * Server Configuration & Environment Variable Validator
 * Handles Render & development environment variables with strict secret hygiene.
 */

import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  appName: string;
  appMode: 'personal' | 'public';
  port: number;
  appBaseUrl: string;
  githubClientId: string;
  githubClientSecret: string;
  githubCallbackUrl: string;
  sessionSecret: string;
  tokenEncryptionKey: string;
  databaseUrl?: string;
  isGitHubConfigured: boolean;
}

function resolveAppBaseUrl(): string {
  // 1. Explicitly configured APP_BASE_URL (e.g. Render https://sitehub-lnuh.onrender.com)
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/+$/, '');
  }
  // 2. AI Studio container APP_URL
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  // 3. Render default RENDER_EXTERNAL_URL
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '');
  }
  // 4. Default fallback
  return 'https://sitehub-lnuh.onrender.com';
}

function resolveCallbackUrl(baseUrl: string): string {
  if (process.env.GITHUB_CALLBACK_URL) {
    return process.env.GITHUB_CALLBACK_URL;
  }
  return `${baseUrl}/api/authgithub/callback`;
}

export function getServerConfig(): ServerConfig {
  const appBaseUrl = resolveAppBaseUrl();
  const githubClientId = process.env.GITHUB_CLIENT_ID?.trim() || '';
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim() || '';
  const githubCallbackUrl = resolveCallbackUrl(appBaseUrl);

  const sessionSecret =
    process.env.SESSION_SECRET?.trim() ||
    process.env.APP_ENCRYPTION_KEY?.trim() ||
    'sitehub-default-dev-session-secret-change-in-production';

  const tokenEncryptionKey =
    process.env.TOKEN_ENCRYPTION_KEY?.trim() ||
    process.env.APP_ENCRYPTION_KEY?.trim() ||
    'sitehub-default-dev-encryption-key-32';

  const isGitHubConfigured = Boolean(githubClientId && githubClientSecret);

  return {
    appName: process.env.APP_NAME || 'SiteHub',
    appMode: (process.env.APP_MODE as 'personal' | 'public') || 'personal',
    port: parseInt(process.env.PORT || '3000', 10),
    appBaseUrl,
    githubClientId,
    githubClientSecret,
    githubCallbackUrl,
    sessionSecret,
    tokenEncryptionKey,
    databaseUrl: process.env.DATABASE_URL,
    isGitHubConfigured,
  };
}

export function validateEnvironmentAtStartup(): { valid: boolean; missing: string[]; warnings: string[] } {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!process.env.GITHUB_CLIENT_ID) missing.push('GITHUB_CLIENT_ID');
  if (!process.env.GITHUB_CLIENT_SECRET) missing.push('GITHUB_CLIENT_SECRET');

  if (!process.env.SESSION_SECRET) {
    warnings.push('SESSION_SECRET is not set; using fallback key (set this in Render dashboard for production).');
  }
  if (!process.env.TOKEN_ENCRYPTION_KEY) {
    warnings.push('TOKEN_ENCRYPTION_KEY is not set; using fallback encryption key.');
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}
