/**
 * Automated Test Suite for GitHub OAuth, State Validation, Encryption, and File Sanitization
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  decryptToken,
  encryptToken,
  generateOAuthState,
  generateSessionId,
  redactSecrets,
} from '../server/security/encryption';
import { sanitizeCommitFiles, validateRepoName } from '../server/github/githubApi';
import { db } from '../server/storage/db';

describe('1. Cryptographic Security & Encryption', () => {
  it('should encrypt and decrypt access tokens using AES-256-GCM', () => {
    const originalToken = 'ghp_secretTokenWithHighEntropy1234567890abcdef';
    const encrypted = encryptToken(originalToken);

    assert.notStrictEqual(encrypted, originalToken);
    assert.match(encrypted, /^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/); // iv:tag:ciphertext

    const decrypted = decryptToken(encrypted);
    assert.strictEqual(decrypted, originalToken);
  });

  it('should generate cryptographically random OAuth state with sufficient entropy', () => {
    const state1 = generateOAuthState();
    const state2 = generateOAuthState();

    assert.strictEqual(typeof state1, 'string');
    assert.strictEqual(state1.length, 64); // 32 bytes in hex
    assert.notStrictEqual(state1, state2);
  });

  it('should redact sensitive tokens and credentials from text strings', () => {
    const rawLog = 'Authorization failed for ghp_abcdef1234567890abcdef and Bearer secret_token_xyz987';
    const redacted = redactSecrets(rawLog);

    assert.strictEqual(redacted.includes('ghp_abcdef1234567890abcdef'), false);
    assert.strictEqual(redacted.includes('secret_token_xyz987'), false);
    assert.match(redacted, /gh_••••••••/);
    assert.match(redacted, /Bearer\s+••••••••/);
  });
});

describe('2. OAuth State Storage & CSRF Protection', () => {
  it('should store and successfully verify a valid OAuth state', () => {
    const sessionId = generateSessionId();
    const state = generateOAuthState();

    db.setOAuthState(sessionId, state, 600000); // 10 minutes

    const result = db.verifyAndConsumeOAuthState(state);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.session?.id, sessionId);
  });

  it('should reject replay of an already consumed OAuth state', () => {
    const sessionId = generateSessionId();
    const state = generateOAuthState();

    db.setOAuthState(sessionId, state, 600000);
    const firstAttempt = db.verifyAndConsumeOAuthState(state);
    assert.strictEqual(firstAttempt.valid, true);

    // Second attempt with identical state should be rejected
    const replayAttempt = db.verifyAndConsumeOAuthState(state);
    assert.strictEqual(replayAttempt.valid, false);
  });

  it('should reject an expired OAuth state', () => {
    const sessionId = generateSessionId();
    const state = generateOAuthState();

    // Expired immediately (-10 seconds)
    db.setOAuthState(sessionId, state, -10000);

    const result = db.verifyAndConsumeOAuthState(state);
    assert.strictEqual(result.valid, false);
  });

  it('should reject non-existent or tampered OAuth state', () => {
    const result = db.verifyAndConsumeOAuthState('tampered_fake_state_123');
    assert.strictEqual(result.valid, false);
  });
});

describe('3. Repository Name Validation & Sanitization', () => {
  it('should validate and sanitize standard repository names', () => {
    const res = validateRepoName('My-Awesome Site_2026!');
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.sanitized, 'My-Awesome-Site_2026');
  });

  it('should reject empty or whitespace-only repository names', () => {
    const res = validateRepoName('   ');
    assert.strictEqual(res.valid, false);
  });

  it('should reject names longer than 100 characters', () => {
    const longName = 'a'.repeat(105);
    const res = validateRepoName(longName);
    assert.strictEqual(res.valid, false);
  });
});

describe('4. File Path Sanitization & Secret Filtration', () => {
  it('should block directory traversal paths (e.g. ../ or absolute /)', () => {
    const files = {
      'index.html': '<html><body>Hello</body></html>',
      '../../etc/passwd': 'root:x:0:0:',
      '..\\windows\\system32': 'danger',
      '/var/log/app.log': 'logs',
      'README.md': '# Welcome',
    };

    const sanitized = sanitizeCommitFiles(files);
    assert.strictEqual(Object.keys(sanitized).length, 2);
    assert.ok(sanitized['index.html']);
    assert.ok(sanitized['README.md']);
    assert.strictEqual(sanitized['../../etc/passwd'], undefined);
    assert.strictEqual(sanitized['/var/log/app.log'], undefined);
  });

  it('should block sensitive files (.env, .git, private keys)', () => {
    const files = {
      '.env': 'SECRET_KEY=12345',
      '.env.production': 'API_KEY=xyz',
      'id_rsa': '-----BEGIN RSA PRIVATE KEY-----',
      'server.key': 'KEY',
      '.git/config': '[core]',
      'src/App.tsx': 'export default function App() {}',
    };

    const sanitized = sanitizeCommitFiles(files);
    assert.strictEqual(Object.keys(sanitized).length, 1);
    assert.ok(sanitized['src/App.tsx']);
    assert.strictEqual(sanitized['.env'], undefined);
    assert.strictEqual(sanitized['id_rsa'], undefined);
  });

  it('should redact leaked API keys inside file contents before committing', () => {
    const files = {
      'src/config.ts': 'export const API_KEY = "sk-abcdef1234567890abcdef12345";',
    };

    const sanitized = sanitizeCommitFiles(files);
    assert.strictEqual(sanitized['src/config.ts'].includes('sk-abcdef1234567890abcdef12345'), false);
    assert.match(sanitized['src/config.ts'], /sk-••••••••/);
  });
});

describe('5. Multi-User Database & Connection Isolation', () => {
  it('should isolate GitHub connections between different user IDs', () => {
    const userA = 'user_alpha_1';
    const userB = 'user_beta_2';

    db.saveGitHubConnection({
      userId: userA,
      githubUserId: 11111,
      username: 'alice',
      avatarUrl: 'https://github.com/alice.png',
      encryptedAccessToken: encryptToken('token_alice'),
      scopes: ['repo'],
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    db.saveGitHubConnection({
      userId: userB,
      githubUserId: 22222,
      username: 'bob',
      avatarUrl: 'https://github.com/bob.png',
      encryptedAccessToken: encryptToken('token_bob'),
      scopes: ['repo'],
      connectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const connA = db.getGitHubConnection(userA);
    const connB = db.getGitHubConnection(userB);

    assert.strictEqual(connA?.username, 'alice');
    assert.strictEqual(connB?.username, 'bob');
    assert.strictEqual(decryptToken(connA!.encryptedAccessToken), 'token_alice');
    assert.strictEqual(decryptToken(connB!.encryptedAccessToken), 'token_bob');

    // Disconnecting user A does not affect user B
    db.deleteGitHubConnection(userA);
    assert.strictEqual(db.getGitHubConnection(userA), null);
    assert.strictEqual(db.getGitHubConnection(userB)?.username, 'bob');
  });
});
