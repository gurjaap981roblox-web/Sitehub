/**
 * Server-Side Cryptographic Token Encryption & Redaction
 * AES-256-GCM authenticated encryption for OAuth access tokens.
 * Tokens are encrypted at rest and never exposed to the frontend or logs.
 */

import crypto from 'crypto';
import { getServerConfig } from '../config';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_STRING = 'sitehub-token-kdf-salt-v1';

// Derive a 32-byte key from the configured encryption secret
function getDerivedKey(): Buffer {
  const config = getServerConfig();
  return crypto.scryptSync(config.tokenEncryptionKey, SALT_STRING, 32);
}

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt a plaintext token using AES-256-GCM.
 */
export function encryptToken(token: string): string {
  if (!token) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getDerivedKey();

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag().toString('hex');
  // Format: iv:tag:encrypted
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

/**
 * Decrypt an AES-256-GCM encrypted token.
 */
export function decryptToken(encryptedString: string): string {
  if (!encryptedString) return '';
  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, tagHex, cipherTextHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const key = getDerivedKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(cipherTextHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generate a cryptographically secure random state parameter for OAuth CSRF protection.
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a cryptographically secure session ID.
 */
export function generateSessionId(): string {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Redact sensitive tokens and headers from log outputs.
 */
export function redactSecrets(text: string): string {
  if (!text) return text;
  return text
    .replace(/(gh[pousr]_[A-Za-z0-9_]{16,})/g, 'gh_••••••••')
    .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]{15,}/gi, '$1••••••••')
    .replace(/(client_secret=)[^&\s]+/gi, '$1••••••••')
    .replace(/(code=)[^&\s]+/gi, '$1••••••••')
    .replace(/(state=)[^&\s]+/gi, '$1••••••••');
}
