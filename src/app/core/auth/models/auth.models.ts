export interface UserProfile {
  id: string;
  username: string;
  email: string;
//  firstname: string;
  role: 'User' | 'Admin';
}

export interface AuthTokenPayload {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
   user: UserProfile;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
    expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
