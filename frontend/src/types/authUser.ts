export interface User {
  _id: string;
  email: string;
  token: string;
}

export interface AuthUser {
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: User;
}
