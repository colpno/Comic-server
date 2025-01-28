export interface User {
  id: string;
  username: string;
  email: string;
  password: Password;
  refreshToken: string;
}

interface Password {
  hashed: string;
  salt: string;
}
