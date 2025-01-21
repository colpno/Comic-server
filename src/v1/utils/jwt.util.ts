import * as jose from 'jose';

interface Options {
  expiresIn?: Parameters<jose.ProduceJWT['setExpirationTime']>[0];
}

// Function to generate a 256-bit key
async function generateKey(secret: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', keyData);
  return new Uint8Array(hash);
}

// Function to sign a JWT
export async function signJWT(
  payload: jose.JWTPayload,
  secret: string,
  options?: Options
): Promise<string> {
  const secretKey = await generateKey(secret);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(options?.expiresIn || '15m')
    .sign(secretKey);
}

// Function to encrypt a JWT
export async function encryptJWT(
  payload: jose.JWTPayload,
  secret: string,
  options?: Options
): Promise<string> {
  const secretKey = await generateKey(secret);
  return new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(options?.expiresIn || '15m')
    .encrypt(secretKey);
}

// Function to decrypt a JWT
export async function decryptJWT<T extends Record<string, unknown>>(
  token: string,
  secret: string
): Promise<T> {
  const secretKey = await generateKey(secret);
  const { payload } = await jose.jwtDecrypt(token, secretKey);
  return payload as T;
}

// Function to verify a JWT
export async function verifyJWT<T extends Record<string, unknown>>(
  token: string,
  secret: string
): Promise<T> {
  const secretKey = await generateKey(secret);
  const { payload } = await jose.jwtVerify(token, secretKey);
  return payload as T;
}

// Function to sign and then encrypt a JWT
export async function signAndEncryptJWT(
  payload: Record<string, unknown>,
  signSecret: string,
  encryptSecret: string,
  options?: Options
): Promise<string> {
  const signedJWT = await signJWT(payload, signSecret, options);
  const encryptedJWT = await encryptJWT({ jwt: signedJWT }, encryptSecret, options);
  return encryptedJWT;
}

// Function to decrypt and then verify a JWT
export async function decryptAndVerifyJWT<T extends Record<string, unknown>>(
  token: string,
  decryptSecret: string,
  verifySecret: string
): Promise<T> {
  const decryptedPayload = await decryptJWT(token, decryptSecret);
  const signedJWT = (decryptedPayload as { jwt: string }).jwt;
  const verifiedPayload = await verifyJWT(signedJWT, verifySecret);
  return verifiedPayload as T;
}
