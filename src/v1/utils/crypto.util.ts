import { createHash, randomBytes } from 'crypto';

export const generateCSRFToken = () => {
  return randomBytes(20).toString('hex');
};

export const generateSalt = (length: number = 16) => {
  return randomBytes(length).toString('hex');
};

export const hashString = (plainText: string, salt: string, algorithm: string = 'sha256') => {
  const hash = createHash(algorithm);
  hash.update(plainText + salt);
  const hashedValue = hash.digest('hex');
  return { salt, hashedValue };
};
