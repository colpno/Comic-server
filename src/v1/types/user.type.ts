export interface User {
  email: string;
  password: Password;
  refreshToken: string;
}

interface Password {
  hashed: string;
  salt: string;
}
