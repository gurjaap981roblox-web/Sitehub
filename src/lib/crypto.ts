/**
 * Cryptographic helpers for Secrets Manager
 * Uses AES-256-GCM with per-record random IV / nonce.
 */

// Simple hex encoding / decoding
function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const tokens = hex.match(/.{1,2}/g) || [];
  const buffer = new ArrayBuffer(tokens.length);
  const view = new Uint8Array(buffer);
  tokens.forEach((byte, i) => {
    view[i] = parseInt(byte, 16);
  });
  return view;
}

// Derive a 256-bit crypto key from passphrase
async function deriveKey(masterSecret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterSecret.padEnd(32, '0').slice(0, 32)),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('sitehub-master-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(
  plaintext: string,
  masterKey: string = 'sitehub-default-dev-encryption-key-32'
): Promise<{ encryptedHex: string; nonceHex: string; last4: string }> {
  const enc = new TextEncoder();
  const nonce = crypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce for GCM
  const key = await deriveKey(masterKey);

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: nonce,
    },
    key,
    enc.encode(plaintext)
  );

  const cleanLast4 = plaintext.length > 4 ? plaintext.slice(-4) : plaintext;

  return {
    encryptedHex: bufferToHex(ciphertext),
    nonceHex: bufferToHex(nonce),
    last4: cleanLast4,
  };
}

export async function decryptSecret(
  encryptedHex: string,
  nonceHex: string,
  masterKey: string = 'sitehub-default-dev-encryption-key-32'
): Promise<string> {
  try {
    const key = await deriveKey(masterKey);
    const nonce = hexToBuffer(nonceHex);
    const ciphertext = hexToBuffer(encryptedHex);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce as any,
      },
      key,
      ciphertext as any
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    return '';
  }
}

export function maskSecretValue(last4: string): string {
  return `••••••••••••${last4 || '••••'}`;
}

export function redactSecretsInText(text: string, knownLast4List: string[]): string {
  let result = text;
  // Redact Bearer tokens, OpenAI-like keys, and known secrets
  result = result.replace(/Bearer\s+[A-Za-z0-9_\-\.]{15,}/gi, 'Bearer ••••••••••••');
  result = result.replace(/(?:sk-|kira-|nemo-)[A-Za-z0-9_\-]{15,}/gi, 'key-••••••••••••');
  return result;
}
