// AES-256-GCM encryption for OAuth tokens stored in user_tokens table.
// Key is derived from SESSION_SECRET via HKDF (separate info string from the
// cookie sealing key, so the two uses can never collide).
//
// In v1 we make no Whop-as-user API calls — decrypt paths are unreachable but
// the tokens are stored ready for future features.

const ALGORITHM = "AES-GCM";

let _cachedKey: CryptoKey | null = null;

async function getDerivedKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey;

  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");

  // Derive a 32-byte AES key via Web Crypto HKDF.
  // Info string is different from iron-session's internal HKDF derivation to
  // ensure domain separation between cookie sealing and token encryption keys.
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );

  const keyBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0), // empty salt acceptable when input is a password
      info: new TextEncoder().encode("medusa-token-encryption-v1"),
    },
    baseKey,
    256 // 32 bytes for AES-256
  );

  _cachedKey = await crypto.subtle.importKey(
    "raw",
    keyBits,
    { name: ALGORITHM },
    false,
    ["encrypt", "decrypt"]
  );

  return _cachedKey;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a base64url-encoded string: `<iv_hex>:<ciphertext_base64url>`
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded
  );

  const ivHex = Buffer.from(iv).toString("hex");
  const ctB64 = Buffer.from(ciphertext).toString("base64url");
  return `${ivHex}:${ctB64}`;
}

/**
 * Decrypts a value produced by `encrypt()`.
 * Throws if the ciphertext is malformed or authentication fails.
 */
export async function decrypt(encrypted: string): Promise<string> {
  const key = await getDerivedKey();
  const colonIdx = encrypted.indexOf(":");
  if (colonIdx === -1) throw new Error("Invalid encrypted token format");

  const iv = Buffer.from(encrypted.slice(0, colonIdx), "hex");
  const ciphertext = Buffer.from(encrypted.slice(colonIdx + 1), "base64url");

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}
