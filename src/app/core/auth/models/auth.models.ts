export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'User' | 'Admin';
}

export interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
