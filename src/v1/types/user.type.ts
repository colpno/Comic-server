export interface User {
  id: string;
  email: string;
  password: Password;
  refreshToken: string;
}

interface Password {
  hashed: string;
  salt: string;
}
